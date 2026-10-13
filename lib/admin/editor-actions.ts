"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { UUID, uniqueSlug } from "@/lib/admin/db";
import { revalidatePublic } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/admin/slug";
import type { EditorArea, EditorPage, EditorSection } from "@/lib/admin/editor-types";
import { buildAnchors, sanitizeSection, validatePageMeta, type FieldErrors } from "@/lib/admin/editor-validate";

export type SaveInput = {
  id: string | null;
  /** updated_at the editor last saw. null = overwrite whatever is there. */
  expectedUpdatedAt: string | null;
  area: EditorArea;
  page: EditorPage;
  sections: EditorSection[];
};

export type SaveResult =
  | { ok: true; id: string; slug: string; updatedAt: string }
  | {
      ok: false;
      error: string;
      code?: "validation" | "conflict" | "slug" | "side_full";
      fieldErrors?: FieldErrors;
      sectionErrors?: Record<string, string>;
    };

export async function savePage(input: SaveInput): Promise<SaveResult> {
  await requireAdmin();

  try {
    const area: EditorArea = input.area === "docs" ? "docs" : "resource";
    const page = input.page;
    const sections = Array.isArray(input.sections) ? input.sections : [];
    if (input.id && !UUID.test(input.id)) return { ok: false, error: "Invalid page." };

    /* ---- validate everything again on the server ---- */
    const fieldErrors = validatePageMeta(page, area);
    const sectionErrors: Record<string, string> = {};
    const cleaned: { id: string; type: string; title: string; content: Record<string, unknown> }[] = [];
    for (const s of sections) {
      if (!UUID.test(s.key)) return { ok: false, error: "Invalid section." };
      const r = sanitizeSection(s);
      if (r.ok) cleaned.push({ id: s.key, type: s.type, title: r.title, content: r.content });
      else sectionErrors[s.key] = r.error;
    }
    if (Object.keys(fieldErrors).length || Object.keys(sectionErrors).length) {
      return { ok: false, error: "Some fields need attention.", code: "validation", fieldErrors, sectionErrors };
    }

    const supabase = await createAuthClient();

    /* ---- the chosen category must belong to this area ---- */
    if (page.categoryId) {
      if (!UUID.test(page.categoryId)) return { ok: false, error: "Invalid category." };
      const { data: cat } = await supabase.from("doc_categories").select("area").eq("id", page.categoryId).maybeSingle();
      if (!cat || cat.area !== area) {
        return {
          ok: false,
          error: "Choose a valid category.",
          code: "validation",
          fieldErrors: { categoryId: "That category doesn't exist any more." },
        };
      }
    }

    /* ---- slug: must be unique ---- */
    let slug = slugify(page.slug);
    const { data: clash } = await supabase.from("doc_pages").select("id").eq("slug", slug).maybeSingle();
    if (clash && clash.id !== input.id) {
      if (page.slugTouched) {
        return {
          ok: false,
          error: "That URL is already used by another page.",
          code: "slug",
          fieldErrors: { slug: "Another page already uses this URL. Choose a different one." },
        };
      }
      slug = await uniqueSlug(supabase, "doc_pages", slug, input.id ?? undefined);
    }

    /* ---- new pages go to the end of their category ---- */
    let orderIndex = page.orderIndex;
    if (orderIndex == null && !input.id) {
      let q = supabase.from("doc_pages").select("order_index");
      q = page.categoryId ? q.eq("category_id", page.categoryId) : q.is("category_id", null);
      const { data: last } = await q.order("order_index", { ascending: false }).limit(1);
      orderIndex = last?.[0] ? last[0].order_index + 1 : 0;
    }

    const anchors = buildAnchors(cleaned.map((s) => s.title));
    const isDocs = area === "docs";

    const { data, error } = await supabase.rpc("admin_save_page", {
      p_id: input.id,
      p_page: {
        category_id: page.categoryId || "",
        slug,
        title: page.title.trim(),
        description: page.description.trim(),
        type: isDocs ? "Doc" : page.type,
        tag: isDocs ? "" : page.tag.trim(),
        read_time: isDocs ? "" : page.readTime.trim(),
        accent: page.accent,
        featured: isDocs ? "" : page.featured,
        cover_image_url: isDocs ? "" : page.cover.trim(),
        published: page.published,
        order_index: orderIndex,
      },
      p_sections: cleaned.map((s, i) => ({ ...s, anchor: anchors[i] })),
      p_expected: input.expectedUpdatedAt,
    });

    if (error) {
      const msg = error.message ?? "";
      if (error.code === "40001" || msg.includes("conflict")) {
        return { ok: false, error: "This page was changed since you opened it.", code: "conflict" };
      }
      if (error.code === "P0001" || msg.includes("side_full")) {
        return {
          ok: false,
          error: "Two pages are already featured as Side.",
          code: "side_full",
          fieldErrors: { featured: "Two pages are already featured as Side. Change one of them first." },
        };
      }
      if (error.code === "23505") {
        return { ok: false, error: "That URL is already used.", code: "slug", fieldErrors: { slug: "Another page already uses this URL." } };
      }
      if (error.code === "P0002" || msg.includes("page_not_found")) {
        return { ok: false, error: "This page no longer exists. It may have been deleted." };
      }
      console.error("admin_save_page failed", error);
      return { ok: false, error: "Couldn't save. Try again in a moment." };
    }

    revalidatePath("/admin", "layout");
    revalidatePublic();
    const result = data as { id: string; updated_at: string };
    return { ok: true, id: result.id, slug, updatedAt: result.updated_at };
  } catch (err) {
    console.error("savePage crashed", err);
    return { ok: false, error: "Something went wrong while saving." };
  }
}

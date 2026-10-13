"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { UUID, uniqueSlug } from "@/lib/admin/db";
import { fail, ok, type ActionResult } from "@/lib/admin/result";
import { revalidatePublic } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/admin/slug";

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");
const done = (message: string): ActionResult => {
  revalidatePath("/admin/categories");
  revalidatePath("/admin", "layout");
  revalidatePublic();
  return ok(message);
};

type Row = { id: string; parent_id: string | null; order_index: number; title: string };

async function siblings(
  supabase: Awaited<ReturnType<typeof createAuthClient>>,
  area: string,
  parentId: string | null
): Promise<Row[]> {
  let q = supabase.from("doc_categories").select("id, parent_id, order_index, title").eq("area", area);
  q = parentId ? q.eq("parent_id", parentId) : q.is("parent_id", null);
  const { data } = await q.order("order_index").order("title");
  return (data ?? []) as Row[];
}

export async function createCategory(fd: FormData): Promise<ActionResult> {
  await requireAdmin();

  const title = text(fd.get("title"));
  const area = text(fd.get("area"));
  const parentId = text(fd.get("parentId")) || null;

  if (!title) return fail("Enter a name for the group.");
  if (title.length > 80) return fail("Keep the name under 80 characters.");
  if (area !== "docs" && area !== "resource") return fail("Unknown area.");
  if (parentId && !UUID.test(parentId)) return fail("Invalid parent.");

  const supabase = await createAuthClient();
  const slug = await uniqueSlug(supabase, "doc_categories", slugify(title) || "group");
  const last = (await siblings(supabase, area, parentId)).at(-1);

  const { error } = await supabase.from("doc_categories").insert({
    title,
    slug,
    area,
    parent_id: parentId,
    order_index: last ? last.order_index + 1 : 0,
  });
  if (error) return fail("Could not create the group.");
  return done(`"${title}" created.`);
}

export async function updateCategory(fd: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = text(fd.get("id"));
  const title = text(fd.get("title"));
  const rawSlug = text(fd.get("slug"));
  const parentId = text(fd.get("parentId")) || null;

  if (!UUID.test(id)) return fail("Invalid category.");
  if (!title) return fail("Enter a name for the group.");
  if (title.length > 80) return fail("Keep the name under 80 characters.");
  if (parentId && !UUID.test(parentId)) return fail("Invalid parent.");

  const supabase = await createAuthClient();
  const { data: current } = await supabase
    .from("doc_categories")
    .select("id, area, parent_id")
    .eq("id", id)
    .maybeSingle();
  if (!current) return fail("That group no longer exists.");

  // A group cannot sit inside itself or one of its own children.
  if (parentId) {
    if (parentId === id) return fail("A group can't be its own parent.");
    const { data: all } = await supabase.from("doc_categories").select("id, parent_id").eq("area", current.area);
    const parentOf = new Map((all ?? []).map((c) => [c.id, c.parent_id as string | null]));
    for (let cursor: string | null = parentId, hops = 0; cursor && hops < 50; hops++) {
      if (cursor === id) return fail("A group can't be moved inside one of its own children.");
      cursor = parentOf.get(cursor) ?? null;
    }
    if (!parentOf.has(parentId)) return fail("That parent no longer exists.");
  }

  const slug = await uniqueSlug(supabase, "doc_categories", slugify(rawSlug || title), id);
  const patch: Record<string, unknown> = { title, slug, parent_id: parentId };

  // Moved to a new parent: go to the end of the new list.
  if ((current.parent_id ?? null) !== parentId) {
    const last = (await siblings(supabase, current.area, parentId)).at(-1);
    patch.order_index = last ? last.order_index + 1 : 0;
  }

  const { error } = await supabase.from("doc_categories").update(patch).eq("id", id);
  if (error) return fail("Could not save changes.");
  return done("Group updated.");
}

export async function moveCategory(fd: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = text(fd.get("id"));
  const dir = text(fd.get("dir"));
  if (!UUID.test(id) || (dir !== "up" && dir !== "down")) return fail("Invalid request.");

  const supabase = await createAuthClient();
  const { data: current } = await supabase
    .from("doc_categories")
    .select("id, area, parent_id")
    .eq("id", id)
    .maybeSingle();
  if (!current) return fail("That group no longer exists.");

  const list = await siblings(supabase, current.area, current.parent_id ?? null);
  const index = list.findIndex((r) => r.id === id);
  const target = dir === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= list.length) return ok();

  [list[index], list[target]] = [list[target], list[index]];

  // Rewrite 0..n so ties in old data can never make the order ambiguous.
  const results = await Promise.all(
    list.map((r, i) => supabase.from("doc_categories").update({ order_index: i }).eq("id", r.id))
  );
  if (results.some((r) => r.error)) return fail("Could not reorder.");
  return done("Order updated.");
}

export async function deleteCategory(fd: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = text(fd.get("id"));
  if (!UUID.test(id)) return fail("Invalid category.");

  const supabase = await createAuthClient();

  const { count: pageCount } = await supabase
    .from("doc_pages")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if (pageCount) return fail(`This group still has ${pageCount} page${pageCount === 1 ? "" : "s"}. Move or delete them first.`);

  const { count: childCount } = await supabase
    .from("doc_categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id);
  if (childCount) return fail("This group has sub-groups. Move or delete them first.");

  const { error } = await supabase.from("doc_categories").delete().eq("id", id);
  if (error) return fail("Could not delete the group.");
  return done("Group deleted.");
}

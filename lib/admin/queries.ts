import { createAuthClient } from "@/lib/supabase/auth-server";
import { UUID } from "@/lib/admin/db";

export const PAGE_SIZE = 20;
export const RESOURCE_TYPES = ["Article", "Guide", "Video", "Blog"] as const;

export type Area = "docs" | "resource";

export type AdminPageRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  tag: string | null;
  published: boolean;
  featured: "main" | "side" | null;
  updated_at: string;
  categoryTitle: string | null;
};

export type CategoryItem = {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  orderIndex: number;
  pageCount: number;
};

/* ------------------------------- dashboard ------------------------------- */

export async function getDashboardData() {
  const supabase = await createAuthClient();
  const pages = () => supabase.from("doc_pages").select("id", { count: "exact", head: true });

  const [docsPub, docsDraft, resPub, resDraft, cats, recent] = await Promise.all([
    pages().eq("type", "Doc").eq("published", true),
    pages().eq("type", "Doc").eq("published", false),
    pages().neq("type", "Doc").eq("published", true),
    pages().neq("type", "Doc").eq("published", false),
    supabase.from("doc_categories").select("id", { count: "exact", head: true }),
    supabase
      .from("doc_pages")
      .select("id, title, type, published, updated_at")
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  return {
    docs: { published: docsPub.count ?? 0, drafts: docsDraft.count ?? 0 },
    resources: { published: resPub.count ?? 0, drafts: resDraft.count ?? 0 },
    categories: cats.count ?? 0,
    recent: (recent.data ?? []) as {
      id: string;
      title: string;
      type: string;
      published: boolean;
      updated_at: string;
    }[],
  };
}

/* --------------------------------- lists --------------------------------- */

export type PageFilters = {
  area: Area;
  q?: string;
  status?: string;
  category?: string;
  type?: string;
  page?: number;
};

export async function listAdminPages(f: PageFilters): Promise<{ rows: AdminPageRow[]; total: number }> {
  const supabase = await createAuthClient();
  const page = Math.max(1, f.page ?? 1);

  let query = supabase
    .from("doc_pages")
    .select("id, slug, title, type, tag, published, featured, updated_at, doc_categories(title)", { count: "exact" });

  query = f.area === "docs" ? query.eq("type", "Doc") : query.neq("type", "Doc");
  if (f.status === "published") query = query.eq("published", true);
  if (f.status === "draft") query = query.eq("published", false);
  if (f.category && UUID.test(f.category)) query = query.eq("category_id", f.category);
  if (f.area === "resource" && f.type && (RESOURCE_TYPES as readonly string[]).includes(f.type)) {
    query = query.eq("type", f.type);
  }

  // Strip characters that have meaning inside a PostgREST filter string.
  const term = (f.q ?? "").replace(/[%,()*\\]/g, " ").trim();
  if (term) query = query.or(`title.ilike.%${term}%,slug.ilike.%${term}%`);

  const from = (page - 1) * PAGE_SIZE;
  const { data, count } = await query
    .order("updated_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const rows = (data ?? []).map((r: any): AdminPageRow => {
    const cat = Array.isArray(r.doc_categories) ? r.doc_categories[0] : r.doc_categories;
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      type: r.type,
      tag: r.tag,
      published: r.published,
      featured: r.featured,
      updated_at: r.updated_at,
      categoryTitle: cat?.title ?? null,
    };
  });

  return { rows, total: count ?? 0 };
}

/* ------------------------------- categories ------------------------------ */

/** Flat list for filter dropdowns, labelled "Parent › Child". */
export async function getCategoryOptions(area: Area): Promise<{ id: string; label: string }[]> {
  const supabase = await createAuthClient();
  const { data } = await supabase
    .from("doc_categories")
    .select("id, title, parent_id, order_index")
    .eq("area", area)
    .order("order_index");

  const rows = data ?? [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  const label = (r: (typeof rows)[number]): string => {
    const parent = r.parent_id ? byId.get(r.parent_id) : null;
    return parent ? `${label(parent)} › ${r.title}` : r.title;
  };
  return rows.map((r) => ({ id: r.id, label: label(r) }));
}

export async function getCategoriesWithCounts(area: Area): Promise<CategoryItem[]> {
  const supabase = await createAuthClient();
  const { data: cats } = await supabase
    .from("doc_categories")
    .select("id, slug, title, parent_id, order_index")
    .eq("area", area)
    .order("order_index");

  const ids = (cats ?? []).map((c) => c.id);
  const counts = new Map<string, number>();
  if (ids.length) {
    const { data: pages } = await supabase.from("doc_pages").select("category_id").in("category_id", ids);
    (pages ?? []).forEach((p) => counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1));
  }

  return (cats ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    parentId: c.parent_id,
    orderIndex: c.order_index,
    pageCount: counts.get(c.id) ?? 0,
  }));
}

/* --------------------------------- editor --------------------------------- */

import type { EditorData } from "@/lib/admin/editor-types";

/** Loads one page + its sections for the editor (drafts included, thanks to the admin RLS policy). */
export async function getEditorData(id: string): Promise<EditorData | null> {
  const supabase = await createAuthClient();
  const [{ data: p }, { data: s }] = await Promise.all([
    supabase.from("doc_pages").select("*").eq("id", id).maybeSingle(),
    supabase.from("page_sections").select("*").eq("page_id", id).order("order_index"),
  ]);
  if (!p) return null;

  return {
    updatedAt: p.updated_at,
    page: {
      id: p.id,
      title: p.title,
      slug: p.slug,
      slugTouched: true, // an existing page's URL never changes just because the title did
      description: p.description ?? "",
      categoryId: p.category_id ?? "",
      type: p.type,
      tag: p.tag ?? "",
      readTime: p.read_time ?? "",
      accent: p.accent ?? "navy",
      featured: (p.featured ?? "") as "" | "main" | "side",
      cover: p.cover_image_url ?? "",
      published: p.published,
      orderIndex: p.order_index,
    },
    sections: (s ?? []).map((row: any) => ({
      key: row.id,
      type: row.type,
      title: row.title ?? "",
      content: (row.content ?? {}) as Record<string, unknown>,
    })),
  };
}

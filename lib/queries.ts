import { supabaseServer } from "./supabase/server";
import type { DocCategory, DocPage, PageSection, Area, PageType } from "./content";

/* -------------------------------------------------------------------------- */
/*  Row -> type mappers (snake_case DB columns -> camelCase app types)        */
/* -------------------------------------------------------------------------- */

function mapCategory(row: any): DocCategory {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    parentId: row.parent_id,
    area: row.area,
    icon: row.icon,
    orderIndex: row.order_index,
  };
}

function mapPage(row: any): DocPage {
  return {
    id: row.id,
    categoryId: row.category_id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    cover: row.cover_image_url,
    type: row.type,
    tag: row.tag,
    readTime: row.read_time,
    category: row.doc_categories?.title ?? null,
    accent: row.accent ?? "navy",
    featured: row.featured,
    orderIndex: row.order_index,
  };
}

function mapSection(row: any): PageSection {
  return {
    id: row.id,
    pageId: row.page_id,
    orderIndex: row.order_index,
    type: row.type,
    title: row.title,
    anchor: row.anchor,
    content: row.content,
  };
}

/* -------------------------------------------------------------------------- */
/*  Docs sidebar                                                              */
/* -------------------------------------------------------------------------- */

/** Flat list of categories for one area, nested into a tree by parent_id. */
export async function getCategoryTree(area: Area): Promise<DocCategory[]> {
  const db = supabaseServer();
  const { data, error } = await db
    .from("doc_categories")
    .select("*")
    .eq("area", area)
    .order("order_index", { ascending: true });

  if (error) throw error;

  const categories = (data ?? []).map(mapCategory);
  const byId = new Map(categories.map((c) => [c.id, { ...c, children: [] as DocCategory[] }]));
  const roots: DocCategory[] = [];

  for (const cat of byId.values()) {
    if (cat.parentId && byId.has(cat.parentId)) {
      byId.get(cat.parentId)!.children!.push(cat);
    } else {
      roots.push(cat);
    }
  }
  return roots;
}

/** Pages grouped under each docs category, for rendering the sidebar links. */
export async function getDocsNavPages(): Promise<DocPage[]> {
  const db = supabaseServer();
  const { data, error } = await db
    .from("doc_pages")
    .select("*, doc_categories!inner(title, area)")
    .eq("doc_categories.area", "docs")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapPage);
}

/* -------------------------------------------------------------------------- */
/*  Single page + its content                                                 */
/* -------------------------------------------------------------------------- */

export async function getPageBySlug(slug: string): Promise<DocPage | null> {
  const db = supabaseServer();
  const { data, error } = await db
    .from("doc_pages")
    .select("*, doc_categories(title, area)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapPage({ ...data, doc_categories: data.doc_categories });
}

export async function getPageSections(pageId: string): Promise<PageSection[]> {
  const db = supabaseServer();
  const { data, error } = await db
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapSection);
}

/* -------------------------------------------------------------------------- */
/*  Resource cards (/resource)                                                */
/* -------------------------------------------------------------------------- */

const RESOURCE_TYPES: PageType[] = ["Article", "Guide", "Video", "Blog"];

/** The "main" + up-to-2 "side" featured cards shown at the top of /resource. */
export async function getFeaturedResources() {
  const db = supabaseServer();
  const { data, error } = await db
    .from("doc_pages")
    .select("*, doc_categories(title, area)")
    .in("type", RESOURCE_TYPES)
    .not("featured", "is", null)
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error) throw error;
  const pages = (data ?? []).map(mapPage);
  return {
    main: pages.find((p) => p.featured === "main") ?? null,
    side: pages.filter((p) => p.featured === "side").slice(0, 2),
  };
}

/**
 * Capped "Latest resources" grid — this is the piece that stops the page
 * from dumping every row in the table onto the homepage. Excludes featured
 * cards (they're already shown above) and respects an optional type filter.
 */
export async function getLatestResources(opts: { limit?: number; type?: string } = {}) {
  const { limit = 9, type } = opts;
  const db = supabaseServer();

  let query = db
    .from("doc_pages")
    .select("*, doc_categories(title, area)")
    .in("type", RESOURCE_TYPES)
    .is("featured", null)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (type && type !== "All") query = query.eq("type", type);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapPage);
}

/** Full listing for /resource/all — paginated, not capped like the homepage grid. */
export async function getAllResources(opts: { page?: number; pageSize?: number; type?: string } = {}) {
  const { page = 0, pageSize = 24, type } = opts;
  const db = supabaseServer();

  let query = db
    .from("doc_pages")
    .select("*, doc_categories(title, area)", { count: "exact" })
    .in("type", RESOURCE_TYPES)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);

  if (type && type !== "All") query = query.eq("type", type);

  const { data, error, count } = await query;
  if (error) throw error;
  return { items: (data ?? []).map(mapPage), total: count ?? 0 };
}

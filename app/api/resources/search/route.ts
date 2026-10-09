import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

const RESOURCE_TYPES = ["Article", "Guide", "Video", "Blog"];

/**
 * GET /api/resources/search?q=...&type=Guide
 * Searches the FULL resources table (doc_pages.search_vector), not just the
 * handful rendered on the homepage — this is what the "Latest resources" grid
 * being capped at 9 needs in order to still make search feel complete.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "All";

  if (!q) return NextResponse.json({ items: [] });

  const db = supabaseServer();
  let query = db
    .from("doc_pages")
    .select("*, doc_categories(title, area)")
    .in("type", RESOURCE_TYPES)
    .eq("published", true)
    .textSearch("search_vector", q, { type: "websearch" })
    .limit(30);

  if (type !== "All") query = query.eq("type", type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).map((row: any) => ({
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
  }));

  return NextResponse.json({ items });
}
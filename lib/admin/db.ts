import type { SupabaseClient } from "@supabase/supabase-js";

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** `base`, or `base-2`, `base-3`… the first slug not already taken in `table`. */
export async function uniqueSlug(
  supabase: SupabaseClient,
  table: "doc_categories" | "doc_pages",
  base: string,
  excludeId?: string
): Promise<string> {
  const root = base || "item";
  for (let i = 1; i < 100; i++) {
    const candidate = i === 1 ? root : `${root}-${i}`;
    let q = supabase.from(table).select("id", { count: "exact", head: true }).eq("slug", candidate);
    if (excludeId) q = q.neq("id", excludeId);
    const { count } = await q;
    if (!count) return candidate;
  }
  return `${root}-${Date.now()}`;
}

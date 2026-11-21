import "server-only";
import { REVALIDATE_SECONDS } from "./config";
import { isHttpUrl } from "./format";
import type { Cursor, FeedPage, FeedSection, Industry, Scope, Story } from "./types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/;
const SLUG = /^[a-z0-9-]{1,60}$/;

export interface FeedArgs {
  section: FeedSection;
  scope?: Scope | null;
  industry?: string | null;
  limit: number;
  before?: Cursor | null;
}

/** Validates untrusted query-string input. Returns null if anything is off. */
export function parseFeedParams(sp: URLSearchParams): FeedArgs | null {
  const section = sp.get("section");
  if (section !== "featured" && section !== "rolling" && section !== "archive") return null;
  const scope = sp.get("scope");
  if (scope !== null && scope !== "india" && scope !== "global") return null;
  const industry = sp.get("industry");
  if (industry !== null && !SLUG.test(industry)) return null;
  const limit = Math.max(1, Math.min(Number(sp.get("limit") ?? 12) || 12, 30));
  const ts = sp.get("beforeTs");
  const id = sp.get("beforeId");
  if ((ts === null) !== (id === null)) return null;
  if (ts !== null && id !== null && (!TS.test(ts.replace(" ", "+")) || !UUID.test(id))) return null;
  return { section, scope: scope as Scope | null, industry, limit, before: ts && id ? { ts: ts.replace(" ", "+"), id } : null };
}

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  return { url: url.replace(/\/$/, ""), key };
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/** Defensive: a malformed row is dropped instead of crashing the page. */
function toStory(r: any): Story | null {
  if (!r || typeof r !== "object" || !UUID.test(str(r.id)) || !str(r.headline) || !isHttpUrl(r.source_url)) return null;
  return {
    id: r.id,
    headline: r.headline,
    summary: str(r.summary),
    why_it_matters: str(r.why_it_matters),
    scope: r.scope === "india" ? "india" : "global",
    region: str(r.region),
    signal_type: str(r.signal_type),
    industries: strs(r.industries),
    audiences: strs(r.audiences),
    suggested_searches: (Array.isArray(r.suggested_searches) ? r.suggested_searches : [])
      .filter((s: any) => s && str(s.label) && str(s.query))
      .map((s: any) => ({ label: str(s.label), query: str(s.query) })),
    score: Number.isFinite(r.score) ? Number(r.score) : 0,
    source_name: str(r.source_name),
    source_url: r.source_url,
    also_covered_by: (Array.isArray(r.also_covered_by) ? r.also_covered_by : [])
      .filter((c: any) => c && str(c.name) && isHttpUrl(c.url))
      .map((c: any) => ({ name: str(c.name), url: c.url })),
    published_at: str(r.published_at),
    pinned: r.pinned === true,
  };
}

export async function getFeed(a: FeedArgs): Promise<FeedPage> {
  const { url, key } = env();
  const res = await fetch(`${url}/rest/v1/rpc/get_feed`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      p_section: a.section,
      p_scope: a.scope ?? null,
      p_industry: a.industry ?? null,
      p_limit: a.limit,
      p_before_ts: a.before?.ts ?? null,
      p_before_id: a.before?.id ?? null,
    }),
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`get_feed failed: HTTP ${res.status}`);
  const rows: unknown = await res.json();
  if (!Array.isArray(rows)) throw new Error("get_feed returned an unexpected shape");
  const items = rows.map(toStory).filter((s): s is Story => s !== null);
  const last = items[items.length - 1];
  return { items, next: rows.length >= a.limit && last ? { ts: last.published_at, id: last.id } : null };
}

/** For pages: never throws, so a database hiccup shows a friendly state instead of a 500. */
export async function getFeedSafe(a: FeedArgs): Promise<FeedPage & { ok: boolean }> {
  try {
    return { ...(await getFeed(a)), ok: true };
  } catch (e) {
    console.error("[news] feed error:", (e as Error).message);
    return { items: [], next: null, ok: false };
  }
}

export async function getIndustriesSafe(): Promise<Industry[]> {
  try {
    const { url, key } = env();
    const res = await fetch(`${url}/rest/v1/industries?select=slug,name&active=eq.true&order=sort_order`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const rows: unknown = await res.json();
    return Array.isArray(rows) ? rows.filter((r: any) => SLUG.test(str(r?.slug)) && str(r?.name)).map((r: any) => ({ slug: r.slug, name: r.name })) : [];
  } catch {
    return [];
  }
}

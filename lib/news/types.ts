export type Scope = "india" | "global";
export type FeedSection = "featured" | "rolling" | "archive";

export interface SuggestedSearch { label: string; query: string }
export interface Covered { name: string; url: string }

/** One card, exactly as returned by the database function get_feed(). */
export interface Story {
  id: string;
  headline: string;
  summary: string;
  why_it_matters: string;
  scope: Scope;
  region: string;
  signal_type: string;
  industries: string[];
  audiences: string[];
  suggested_searches: SuggestedSearch[];
  score: number;
  source_name: string;
  source_url: string;
  also_covered_by: Covered[];
  published_at: string;
  pinned: boolean;
}

export interface Industry { slug: string; name: string }
export interface Cursor { ts: string; id: string }
export interface FeedPage { items: Story[]; next: Cursor | null }

/** Pure helpers for the inbox screens (no server or browser APIs), so they are easy to test. */
import { industryLabel } from "@/lib/demo/industries";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  companySize: string | null;
  topic: string;
  topicLabel: string;
  message: string;
  status: string;
  teamAlerted: boolean;
  confirmationSent: boolean;
  createdAt: string;
};

export type Activity = { at: string; kind: "search" | "unlock" | "book" | "login" | "plans" | "companies"; text: string };
export type Interest = "high" | "medium" | "low";

export type DemoRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  goal: string | null;
  status: string;
  createdAt: string;
  lastActiveAt: string | null;
  expiresAt: string;
  teamAlerted: boolean;
  confirmationSent: boolean;
  searches: number;
  unlocks: number;
  bookClicks: number;
  interest: Interest;
  timeline: Activity[];
};

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?";

export const snippet = (text: string, max = 110) => {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max).trimEnd()}…` : flat;
};

export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d}d ago`;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(iso));
}

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

/**
 * How interested the visitor looks, from what they did in the demo.
 *  high   = asked to book a demo, or went to log in / plans
 *  medium = tried to unlock contacts, or ran 2+ searches
 *  low    = everything else
 */
export function deriveInterest(c: { searches: number; unlocks: number; bookClicks: number; loginOrPlans: number }): Interest {
  if (c.bookClicks > 0 || c.loginOrPlans > 0) return "high";
  if (c.unlocks > 0 || c.searches >= 2) return "medium";
  return "low";
}

type RawSearch = { request_id: string; industry: string; company_query: string | null; leads_count: number; companies_count: number; created_at: string };
type RawEvent = { request_id: string; type: string; meta: Record<string, unknown> | null; created_at: string };

function eventActivity(e: RawEvent): Activity | null {
  switch (e.type) {
    case "unlock_click":
      return { at: e.created_at, kind: "unlock", text: "Clicked “Login to Unlock” on a contact" };
    case "book_demo_click":
      return { at: e.created_at, kind: "book", text: e.meta?.from === "footer-card" ? "Clicked “See it with live data”" : "Clicked “Book a Demo”" };
    case "login_click":
      return { at: e.created_at, kind: "login", text: "Clicked “Log in to AQSTRA”" };
    case "plans_click":
      return { at: e.created_at, kind: "plans", text: "Opened subscription plans" };
    case "view_companies":
      return { at: e.created_at, kind: "companies", text: "Opened the Companies tab" };
    default:
      return null;
  }
}

/** Joins demo requests with their searches and clicks into one row each. */
export function buildDemoRows(requests: any[], searches: RawSearch[], events: RawEvent[]): DemoRow[] {
  const searchesBy = new Map<string, RawSearch[]>();
  searches.forEach((s) => searchesBy.set(s.request_id, [...(searchesBy.get(s.request_id) ?? []), s]));
  const eventsBy = new Map<string, RawEvent[]>();
  events.forEach((e) => eventsBy.set(e.request_id, [...(eventsBy.get(e.request_id) ?? []), e]));

  return requests.map((r) => {
    const ss = searchesBy.get(r.id) ?? [];
    const ee = eventsBy.get(r.id) ?? [];

    const timeline: Activity[] = [
      ...ss.map(
        (s): Activity => ({
          at: s.created_at,
          kind: "search",
          text: `Searched ${industryLabel(s.industry)}${s.company_query ? ` · target “${s.company_query}”` : ""} · ${s.leads_count} leads`,
        })
      ),
      ...ee.map(eventActivity).filter((a): a is Activity => a !== null),
    ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

    const unlocks = ee.filter((e) => e.type === "unlock_click").length;
    const bookClicks = ee.filter((e) => e.type === "book_demo_click").length;
    const loginOrPlans = ee.filter((e) => e.type === "login_click" || e.type === "plans_click").length;

    return {
      id: r.id,
      name: r.full_name,
      email: r.email,
      phone: r.phone ?? null,
      goal: r.goal ?? null,
      status: r.status,
      createdAt: r.created_at,
      lastActiveAt: r.last_active_at ?? null,
      expiresAt: r.expires_at,
      teamAlerted: Boolean(r.admin_notified),
      confirmationSent: Boolean(r.confirmation_sent),
      searches: ss.length,
      unlocks,
      bookClicks,
      interest: deriveInterest({ searches: ss.length, unlocks, bookClicks, loginOrPlans }),
      timeline,
    };
  });
}

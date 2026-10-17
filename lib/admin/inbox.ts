import { createAuthClient } from "@/lib/supabase/auth-server";
import { TOPICS } from "@/lib/contact";
import { DEMO_STATUSES, INBOX_PAGE_SIZE, MESSAGE_STATUSES } from "./inbox-config";
import { buildDemoRows, type DemoRow, type MessageRow } from "./inbox-format";

type Filters = { q?: string; status?: string; topic?: string; page?: number };

// Characters that have meaning inside a PostgREST filter string.
const clean = (q: string | undefined) => (q ?? "").replace(/[%,()*\\]/g, " ").trim();

/* -------------------------------- counts -------------------------------- */

/** Unread counts for the sidebar badges. */
export async function getNewCounts() {
  const supabase = await createAuthClient();
  const [m, d] = await Promise.all([
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("demo_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return { messages: m.count ?? 0, demos: d.count ?? 0 };
}

/** New + total for the dashboard cards. */
export async function getInboxSummary() {
  const supabase = await createAuthClient();
  const head = (table: string) => supabase.from(table).select("id", { count: "exact", head: true });
  const [mNew, mAll, dNew, dAll] = await Promise.all([
    head("contact_submissions").eq("status", "new"),
    head("contact_submissions"),
    head("demo_requests").eq("status", "new"),
    head("demo_requests"),
  ]);
  return {
    messages: { new: mNew.count ?? 0, total: mAll.count ?? 0 },
    demos: { new: dNew.count ?? 0, total: dAll.count ?? 0 },
  };
}

/** Per-status totals for the tabs (not affected by the current search). */
async function statusCounts(table: "contact_submissions" | "demo_requests", statuses: readonly { value: string }[]) {
  const supabase = await createAuthClient();
  const results = await Promise.all([
    supabase.from(table).select("id", { count: "exact", head: true }),
    ...statuses.map((s) => supabase.from(table).select("id", { count: "exact", head: true }).eq("status", s.value)),
  ]);
  const counts: Record<string, number> = { all: results[0].count ?? 0 };
  statuses.forEach((s, i) => (counts[s.value] = results[i + 1].count ?? 0));
  return counts;
}

export const getMessageStatusCounts = () => statusCounts("contact_submissions", MESSAGE_STATUSES);
export const getDemoStatusCounts = () => statusCounts("demo_requests", DEMO_STATUSES);

/* ------------------------------- messages ------------------------------- */

export async function listMessages(f: Filters): Promise<{ rows: MessageRow[]; total: number }> {
  const supabase = await createAuthClient();
  const page = Math.max(1, f.page ?? 1);

  let query = supabase.from("contact_submissions").select("*", { count: "exact" });
  if (f.status && MESSAGE_STATUSES.some((s) => s.value === f.status)) query = query.eq("status", f.status);
  if (f.topic && TOPICS.some((t) => t.value === f.topic)) query = query.eq("topic", f.topic);
  const term = clean(f.q);
  if (term) {
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,company.ilike.%${term}%,message.ilike.%${term}%`
    );
  }

  const from = (page - 1) * INBOX_PAGE_SIZE;
  const { data, count } = await query.order("created_at", { ascending: false }).range(from, from + INBOX_PAGE_SIZE - 1);

  const rows = (data ?? []).map(
    (r: any): MessageRow => ({
      id: r.id,
      name: `${r.first_name} ${r.last_name}`.trim(),
      email: r.email,
      phone: r.phone ?? null,
      company: r.company,
      companySize: r.company_size ?? null,
      topic: r.topic,
      topicLabel: TOPICS.find((t) => t.value === r.topic)?.label ?? r.topic,
      message: r.message,
      status: r.status,
      teamAlerted: Boolean(r.admin_notified),
      confirmationSent: Boolean(r.confirmation_sent),
      createdAt: r.created_at,
    })
  );
  return { rows, total: count ?? 0 };
}

/* ----------------------------- demo requests ----------------------------- */

export async function listDemoRequests(f: Filters): Promise<{ rows: DemoRow[]; total: number }> {
  const supabase = await createAuthClient();
  const page = Math.max(1, f.page ?? 1);

  let query = supabase.from("demo_requests").select("*", { count: "exact" });
  if (f.status && DEMO_STATUSES.some((s) => s.value === f.status)) query = query.eq("status", f.status);
  const term = clean(f.q);
  if (term) query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,goal.ilike.%${term}%`);

  const from = (page - 1) * INBOX_PAGE_SIZE;
  const { data, count } = await query.order("created_at", { ascending: false }).range(from, from + INBOX_PAGE_SIZE - 1);
  const requests = data ?? [];
  const ids = requests.map((r: any) => r.id);

  // Pull what each visitor did in the demo, for just this page of leads.
  const [searches, events] = ids.length
    ? await Promise.all([
        supabase
          .from("demo_searches")
          .select("request_id, industry, company_query, leads_count, companies_count, created_at")
          .in("request_id", ids)
          .order("created_at", { ascending: false }),
        supabase
          .from("demo_events")
          .select("request_id, type, meta, created_at")
          .in("request_id", ids)
          .order("created_at", { ascending: false })
          .limit(1000),
      ])
    : [{ data: [] }, { data: [] }];

  return { rows: buildDemoRows(requests, (searches.data ?? []) as any[], (events.data ?? []) as any[]), total: count ?? 0 };
}

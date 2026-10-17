import { Target } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { DEMO_STATUSES, INBOX_PAGE_SIZE } from "@/lib/admin/inbox-config";
import { getDemoStatusCounts, listDemoRequests } from "@/lib/admin/inbox";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { DemoList } from "@/components/admin/inbox/demo-list";
import { InboxFilters } from "@/components/admin/inbox/inbox-filters";
import { Pagination } from "@/components/admin/inbox/pagination";
import { StatusTabs } from "@/components/admin/inbox/status-tabs";

export const metadata = { title: "Demo requests" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function DemoRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin("/admin/demo-requests");
  const sp = await searchParams;
  const q = first(sp.q);
  const status = first(sp.status) || "all";
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const open = first(sp.open);

  const [{ rows, total }, counts] = await Promise.all([
    listDemoRequests({ q, status: status === "all" ? undefined : status, page }),
    getDemoStatusCounts(),
  ]);

  const filtered = Boolean(q || status !== "all");

  return (
    <>
      <PageHeader
        title="Demo requests"
        description="People who asked for a demo, and what they did once inside it. Open one to see their searches and clicks, and to copy their email or phone."
      />

      <StatusTabs
        basePath="/admin/demo-requests"
        active={status}
        keep={{ q }}
        tabs={[
          { value: "all", label: "All", count: counts.all ?? 0 },
          ...DEMO_STATUSES.map((s) => ({ value: s.value, label: s.label, count: counts[s.value] ?? 0 })),
        ]}
      />

      <InboxFilters q={q} status={status} placeholder="Search name, email or goal" />

      {rows.length === 0 ? (
        <EmptyState
          icon={Target}
          title={filtered ? "No demo requests match those filters" : "No demo requests yet"}
          text={filtered ? "Try a different search, or clear the filters." : "When someone fills in the demo form, they'll appear here with their activity."}
        />
      ) : (
        <>
          <DemoList rows={rows} openId={open || undefined} />
          <Pagination
            basePath="/admin/demo-requests"
            params={{ q, status: status === "all" ? "" : status }}
            page={page}
            total={total}
            pageSize={INBOX_PAGE_SIZE}
          />
        </>
      )}
    </>
  );
}

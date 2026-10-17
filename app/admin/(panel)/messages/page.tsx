import { Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { INBOX_PAGE_SIZE, MESSAGE_STATUSES } from "@/lib/admin/inbox-config";
import { getMessageStatusCounts, listMessages } from "@/lib/admin/inbox";
import { TOPICS } from "@/lib/contact";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { InboxFilters } from "@/components/admin/inbox/inbox-filters";
import { MessageList } from "@/components/admin/inbox/message-list";
import { Pagination } from "@/components/admin/inbox/pagination";
import { StatusTabs } from "@/components/admin/inbox/status-tabs";

export const metadata = { title: "Messages" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin("/admin/messages");
  const sp = await searchParams;
  const q = first(sp.q);
  const status = first(sp.status) || "all";
  const topic = first(sp.topic);
  const page = Math.max(1, Number(first(sp.page)) || 1);
  const open = first(sp.open);

  const [{ rows, total }, counts] = await Promise.all([
    listMessages({ q, status: status === "all" ? undefined : status, topic, page }),
    getMessageStatusCounts(),
  ]);

  const filtered = Boolean(q || topic || status !== "all");
  const keep = { q, topic };

  return (
    <>
      <PageHeader
        title="Messages"
        description="Messages sent through the contact form. Open one to read it in full and copy the email or phone number."
      />

      <StatusTabs
        basePath="/admin/messages"
        active={status}
        keep={keep}
        tabs={[
          { value: "all", label: "All", count: counts.all ?? 0 },
          ...MESSAGE_STATUSES.map((s) => ({ value: s.value, label: s.label, count: counts[s.value] ?? 0 })),
        ]}
      />

      <InboxFilters
        q={q}
        status={status}
        placeholder="Search name, email, company or message"
        selects={[
          {
            name: "topic",
            label: "Topic",
            allLabel: "All topics",
            value: topic,
            options: TOPICS.map((t) => ({ value: t.value, label: t.label })),
          },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={filtered ? "No messages match those filters" : "No messages yet"}
          text={filtered ? "Try a different search, or clear the filters." : "When someone uses the contact form, their message will appear here."}
        />
      ) : (
        <>
          <MessageList rows={rows} openId={open || undefined} />
          <Pagination
            basePath="/admin/messages"
            params={{ q, topic, status: status === "all" ? "" : status }}
            page={page}
            total={total}
            pageSize={INBOX_PAGE_SIZE}
          />
        </>
      )}
    </>
  );
}

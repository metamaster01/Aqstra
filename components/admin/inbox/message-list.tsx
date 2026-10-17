"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar, DetailRow, Delivery } from "./detail";
import { Time } from "./local-time";
import { StatusSelect } from "./status-select";
import { Badge, cardClass } from "@/components/admin/ui";
import { MESSAGE_STATUSES, STATUS_TONE } from "@/lib/admin/inbox-config";
import { setMessageStatus } from "@/lib/admin/inbox-actions";
import { snippet, type MessageRow } from "@/lib/admin/inbox-format";

/** Contact-form messages. Each row opens to the full message and details. Nothing here sends mail. */
export function MessageList({ rows, openId }: { rows: MessageRow[]; openId?: string }) {
  const [open, setOpen] = useState<string | null>(openId ?? null);

  return (
    <ul className="space-y-2.5">
      {rows.map((m) => {
        const isOpen = open === m.id;
        const isNew = m.status === "new";
        const label = MESSAGE_STATUSES.find((s) => s.value === m.status)?.label ?? m.status;

        return (
          <li key={m.id} className={`${cardClass} overflow-hidden ${isNew ? "border-l-[3px] border-l-primary" : ""}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`message-${m.id}`}
              onClick={() => setOpen(isOpen ? null : m.id)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-foreground/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <Avatar name={m.name} />

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className={`truncate text-[14.5px] ${isNew ? "font-bold" : "font-semibold"}`}>{m.name}</span>
                  <span className="hidden truncate text-[12.5px] text-muted sm:inline">{m.email}</span>
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-foreground/75">{snippet(m.message)}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-1.5 md:hidden">
                  <Badge>{m.topicLabel}</Badge>
                  <span className="truncate text-[12px] text-muted">{m.company}</span>
                </span>
              </span>

              <span className="hidden shrink-0 items-center gap-3 md:flex">
                <Badge>{m.topicLabel}</Badge>
                <span className="max-w-[150px] truncate text-[12.5px] text-muted">{m.company}</span>
              </span>

              <span className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-[12px] text-muted">
                  <Time iso={m.createdAt} />
                </span>
                <Badge tone={STATUS_TONE[m.status] ?? "neutral"}>{label}</Badge>
              </span>

              <ChevronDown aria-hidden className={`size-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div id={`message-${m.id}`} className="grid gap-5 border-t border-border bg-foreground/[0.02] p-4 sm:p-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                <section aria-label="Message">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Message</p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-[14.5px] leading-[1.75]">{m.message}</p>
                </section>

                <section aria-label="Details" className="rounded-xl border border-border bg-card px-4 py-1 dark:border-white/15">
                  <div className="divide-y divide-border">
                    <DetailRow label="Email" value={m.email} copy />
                    <DetailRow label="Phone" value={m.phone} copy />
                    <DetailRow label="Company" value={m.company} />
                    <DetailRow label="Company size" value={m.companySize ? `${m.companySize} employees` : null} />
                    <DetailRow label="Topic" value={m.topicLabel} />
                    <div className="py-2.5">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Received</p>
                      <p className="mt-0.5 text-[14px]">
                        <Time iso={m.createdAt} mode="full" />
                      </p>
                    </div>
                    <div className="space-y-1.5 py-2.5">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Emails sent for this message</p>
                      <Delivery label="Alert to your team" ok={m.teamAlerted} />
                      <br />
                      <Delivery label="Confirmation to sender" ok={m.confirmationSent} />
                    </div>
                    <div className="flex items-center justify-between gap-3 py-3">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Status</p>
                      <StatusSelect id={m.id} value={m.status} options={MESSAGE_STATUSES} action={setMessageStatus} />
                    </div>
                  </div>
                </section>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

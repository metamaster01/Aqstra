"use client";

import { useState } from "react";
import { Building2, CalendarCheck, ChevronDown, CreditCard, Lock, LogIn, Search, type LucideIcon } from "lucide-react";
import { Avatar, DetailRow, Delivery } from "./detail";
import { Time } from "./local-time";
import { StatusSelect } from "./status-select";
import { Badge, cardClass } from "@/components/admin/ui";
import { DEMO_STATUSES, STATUS_TONE } from "@/lib/admin/inbox-config";
import { setDemoStatus } from "@/lib/admin/inbox-actions";
import { snippet, type Activity, type DemoRow, type Interest } from "@/lib/admin/inbox-format";

const ICON: Record<Activity["kind"], LucideIcon> = {
  search: Search,
  unlock: Lock,
  book: CalendarCheck,
  login: LogIn,
  plans: CreditCard,
  companies: Building2,
};

const INTEREST: Record<Interest, { label: string; tone: "success" | "warning" | "neutral" }> = {
  high: { label: "High interest", tone: "success" },
  medium: { label: "Some interest", tone: "warning" },
  low: { label: "Low interest", tone: "neutral" },
};

/** People who requested a demo, with what they did in it. Each row opens to the full picture. Nothing here sends mail. */
export function DemoList({ rows, openId }: { rows: DemoRow[]; openId?: string }) {
  const [open, setOpen] = useState<string | null>(openId ?? null);

  return (
    <ul className="space-y-2.5">
      {rows.map((d) => {
        const isOpen = open === d.id;
        const isNew = d.status === "new";
        const label = DEMO_STATUSES.find((s) => s.value === d.status)?.label ?? d.status;
        const interest = INTEREST[d.interest];
        const expired = new Date(d.expiresAt).getTime() < Date.now();

        const summary = [
          d.searches ? `${d.searches} search${d.searches === 1 ? "" : "es"}` : "No searches yet",
          d.unlocks ? `${d.unlocks} unlock attempt${d.unlocks === 1 ? "" : "s"}` : null,
          d.bookClicks ? "asked to book" : null,
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <li key={d.id} className={`${cardClass} overflow-hidden ${isNew ? "border-l-[3px] border-l-primary" : ""}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`demo-${d.id}`}
              onClick={() => setOpen(isOpen ? null : d.id)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-foreground/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <Avatar name={d.name} />

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className={`truncate text-[14.5px] ${isNew ? "font-bold" : "font-semibold"}`}>{d.name}</span>
                  <span className="hidden truncate text-[12.5px] text-muted sm:inline">{d.email}</span>
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-foreground/75">{summary}</span>
                <span className="mt-1.5 md:hidden">
                  <Badge tone={interest.tone}>{interest.label}</Badge>
                </span>
              </span>

              <span className="hidden shrink-0 md:block">
                <Badge tone={interest.tone}>{interest.label}</Badge>
              </span>

              <span className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-[12px] text-muted">
                  <Time iso={d.createdAt} />
                </span>
                <Badge tone={STATUS_TONE[d.status] ?? "neutral"}>{label}</Badge>
              </span>

              <ChevronDown aria-hidden className={`size-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div id={`demo-${d.id}`} className="grid gap-5 border-t border-border bg-foreground/[0.02] p-4 sm:p-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                <section aria-label="Demo activity">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">What they did in the demo</p>
                  {d.timeline.length === 0 ? (
                    <p className="mt-3 text-[14px] text-muted">
                      Nothing yet. They haven&apos;t searched or clicked anything{d.lastActiveAt ? "" : ", and haven't opened the demo"}.
                    </p>
                  ) : (
                    <ol className="mt-3 space-y-3">
                      {d.timeline.map((a, i) => {
                        const Icon = ICON[a.kind];
                        return (
                          <li key={`${a.at}-${i}`} className="flex items-start gap-3">
                            <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary dark:text-[#9db8ff]">
                              <Icon className="size-3.5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block break-words text-[14px] leading-snug">{a.text}</span>
                              <span className="text-[12px] text-muted">
                                <Time iso={a.at} />
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </section>

                <section aria-label="Details" className="rounded-xl border border-border bg-card px-4 py-1 dark:border-white/15">
                  <div className="divide-y divide-border">
                    <DetailRow label="Email" value={d.email} copy />
                    <DetailRow label="Phone" value={d.phone} copy />
                    <DetailRow label="Primary goal" value={d.goal} />
                    <div className="py-2.5">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Requested</p>
                      <p className="mt-0.5 text-[14px]">
                        <Time iso={d.createdAt} mode="full" />
                      </p>
                    </div>
                    <div className="py-2.5">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Last active in demo</p>
                      <p className="mt-0.5 text-[14px]">{d.lastActiveAt ? <Time iso={d.lastActiveAt} /> : "Never"}</p>
                    </div>
                    <div className="py-2.5">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Demo link</p>
                      <p className="mt-0.5 text-[14px]">
                        {expired ? "Expired " : "Active until "}
                        <Time iso={d.expiresAt} mode="full" />
                      </p>
                    </div>
                    <div className="space-y-1.5 py-2.5">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Emails sent for this request</p>
                      <Delivery label="Alert to your team" ok={d.teamAlerted} />
                      <br />
                      <Delivery label="Demo link to visitor" ok={d.confirmationSent} />
                    </div>
                    <div className="flex items-center justify-between gap-3 py-3">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">Status</p>
                      <StatusSelect id={d.id} value={d.status} options={DEMO_STATUSES} action={setDemoStatus} />
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

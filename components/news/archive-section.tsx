"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, ChevronDown, Loader2 } from "lucide-react";
import { ARCHIVE_PAGE } from "@/lib/news/config";
import { clockTime, dayLabel } from "@/lib/news/format";
import type { Story } from "@/lib/news/types";
import { useNews } from "./news-provider";
import { SectionHeading } from "./section-heading";
import { EmptyState, RetryButton } from "./states";
import { signalMeta } from "./signals";
import { useFeed } from "./use-feed";

/** Collapsed by default. Nothing is fetched until the visitor opens it. */
export function ArchiveSection() {
  const [open, setOpen] = useState(false);
  const { scope, industry, openStory } = useNews();
  const { items, status, hasMore, loadingMore, loadMore, retry } = useFeed({ section: "archive", scope, industry, pageSize: ARCHIVE_PAGE, enabled: open });

  const groups = useMemo(() => {
    const m = new Map<string, Story[]>();
    for (const s of items) { const k = dayLabel(s.published_at); m.set(k, [...(m.get(k) ?? []), s]); }
    return [...m.entries()];
  }, [items]);

  return (
    <section aria-labelledby="archive-title" className="py-16">
      <SectionHeading id="archive-title" eyebrow="Archive" title="Missed something?" blurb="Everything from the last two weeks, newest first. Older stories are removed to keep the page fast." />

      <button
        type="button" aria-expanded={open} aria-controls="archive-panel" onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card/70 px-5 py-4 text-left transition-all hover:border-primary/50"
      >
        <span className="flex items-center gap-3 font-display text-lg font-bold"><Archive className="size-5 text-primary" aria-hidden /> Browse the archive</span>
        <ChevronDown className={`size-5 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div id="archive-panel" key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="pt-6">
              {status === "loading" && <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-primary" aria-label="Loading archive" /></div>}
              {status === "error" && <EmptyState title="Couldn't load the archive" body="Please try again." action={<RetryButton onClick={retry} />} />}
              {status === "idle" && items.length === 0 && <EmptyState title="Nothing in the archive yet" body="Stories move here after a week and stay for two." />}

              {groups.map(([day, list]) => (
                <div key={day} className="mb-8">
                  <h3 className="sticky top-[58px] z-10 -mx-1 mb-2 bg-background/90 px-1 py-2 text-xs font-bold uppercase tracking-[0.14em] text-muted backdrop-blur">{day}</h3>
                  <ul className="divide-y divide-border rounded-2xl border border-border bg-card/60">
                    {list.map((s) => {
                      const m = signalMeta(s.signal_type);
                      const Icon = m.icon;
                      return (
                        <li key={s.id}>
                          <button type="button" onClick={() => openStory(s)} className="group/row flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-primary/[0.05]">
                            <span className={`grid size-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${m.chip}`}><Icon className="size-4" aria-hidden /></span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[15px] font-semibold group-hover/row:text-primary">{s.headline}</span>
                              <span className="block truncate text-xs text-muted">{s.source_name} · {clockTime(s.published_at)} · {s.scope === "india" ? "India" : "Global"}</span>
                            </span>
                            <span className="hidden text-sm font-bold text-muted sm:block" title="Impact score">{s.score}/10</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {hasMore && (
                <div className="flex justify-center">
                  <button type="button" onClick={loadMore} disabled={loadingMore} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-all hover:border-primary hover:text-primary disabled:opacity-60">
                    {loadingMore && <Loader2 className="size-4 animate-spin" aria-hidden />} Load older stories
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

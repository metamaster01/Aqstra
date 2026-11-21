"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { clockTime, dayLabel } from "@/lib/news/format";
import type { Story } from "@/lib/news/types";
import { RelativeTime } from "./relative-time";
import { ScoreRing } from "./score-ring";
import { SearchChips } from "./search-chips";
import { SignalChip } from "./signal-chip";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const AUDIENCE_LABEL: Record<string, string> = {
  "sales-teams": "Sales teams",
  "business-development": "Business development",
  "marketing-agencies": "Marketing agencies",
  "founders-startups": "Founders & startups",
  "growth-teams": "Growth teams",
  consultants: "Consultants",
};

/** Side sheet on desktop, bottom sheet on phones. Esc closes; focus is trapped and restored. */
export function StoryDrawer({ story, onClose }: { story: Story | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!story) return;
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const els = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!els.length) return;
      const first = els[0]!, last = els[els.length - 1]!;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [story, onClose]);

  return (
    <AnimatePresence>
      {story && (
        // data-lenis-prevent: smooth-scroll libraries must leave scrolling inside the sheet alone
        <div className="fixed inset-0 z-[100]" data-lenis-prevent>
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            ref={panel}
            role="dialog" aria-modal="true" aria-label={story.headline}
            className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[560px] sm:rounded-l-3xl sm:rounded-tr-none"
            initial={reduce ? { opacity: 0 } : { y: "8%", x: 0, opacity: 0 }}
            animate={{ y: 0, x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "6%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <SignalChip slug={story.signal_type} />
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{story.scope === "india" ? "India" : "Global"}</span>
              </div>
              <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-6">
              <div className="flex items-start gap-4">
                <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-[28px]">{story.headline}</h2>
                <ScoreRing score={story.score} size={52} />
              </div>
              <p className="text-xs text-muted">
                {story.source_name} · <RelativeTime iso={story.published_at} /> · {dayLabel(story.published_at)}, {clockTime(story.published_at)}
              </p>
              <p className="text-base leading-7 text-foreground/90">{story.summary}</p>

              <section className="rounded-2xl border-l-2 border-primary bg-primary/[0.06] px-4 py-3.5">
                <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary dark:text-[#9db6ff]">Why it matters</h3>
                <p className="leading-7">{story.why_it_matters}</p>
              </section>

              {story.suggested_searches.length > 0 && (
                <section>
                  <h3 className="mb-1 font-display text-lg font-bold">Search this on Aqstra</h3>
                  <p className="mb-3 text-sm text-muted">One click opens the search, already filled in.</p>
                  <SearchChips searches={story.suggested_searches} size="lg" />
                </section>
              )}

              {story.audiences.length > 0 && (
                <section>
                  <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Most useful for</h3>
                  <ul className="flex flex-wrap gap-2">
                    {story.audiences.map((a) => (
                      <li key={a} className="rounded-full border border-border px-3 py-1 text-xs font-medium">{AUDIENCE_LABEL[a] ?? a}</li>
                    ))}
                  </ul>
                </section>
              )}

              {story.also_covered_by.length > 0 && (
                <section>
                  <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Also covered by</h3>
                  <ul className="space-y-1.5 text-sm">
                    {story.also_covered_by.map((c) => (
                      <li key={c.url}>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline">
                          {c.name} <ExternalLink className="size-3" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="border-t border-border bg-card/60 px-6 py-4">
              <a href={story.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold transition-all hover:border-primary hover:text-primary">
                Read the original at {story.source_name} <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

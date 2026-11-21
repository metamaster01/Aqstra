"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Story } from "@/lib/news/types";
import { useNews } from "./news-provider";
import { RelativeTime } from "./relative-time";
import { SearchChips } from "./search-chips";
import { SignalChip } from "./signal-chip";

/** Hero visual: the latest top stories as a card deck that rotates by itself. */
export function SignalStack({ stories }: { stories: Story[] }) {
  const reduce = useReducedMotion();
  const { openStory } = useNews();
  const deck = stories.slice(0, 4);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || deck.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % deck.length), 4800);
    return () => clearInterval(t);
  }, [reduce, paused, deck.length]);

  if (deck.length === 0) {
    return (
      <div className="grid h-[420px] place-items-center rounded-3xl border border-dashed border-border text-sm text-muted">
        Live signals will appear here
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[440px] w-full max-w-[520px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-primary/20 blur-3xl dark:bg-[#3a3690]/40" />
      {deck.map((s, i) => {
        const p = (i - active + deck.length) % deck.length; // 0 = front
        return (
          <motion.div
            key={s.id}
            className="absolute inset-x-0 top-0"
            style={{ zIndex: deck.length - p, pointerEvents: p === 0 ? "auto" : "none" }}
            animate={{ y: p * 22, scale: 1 - p * 0.045, opacity: p > 2 ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <div
              className="rounded-3xl border border-border bg-card p-6 shadow-[0_30px_60px_-30px_rgba(37,99,235,.5)]"
              aria-hidden={p !== 0}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <SignalChip slug={s.signal_type} />
                <RelativeTime iso={s.published_at} className="text-xs text-muted" />
              </div>
              <h3 className="font-display text-xl font-bold leading-snug">
                <button type="button" tabIndex={p === 0 ? 0 : -1} onClick={() => openStory(s)} className="text-left hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">{s.headline}</button>
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{s.why_it_matters}</p>
              {p === 0 && <SearchChips searches={s.suggested_searches.slice(0, 2)} className="mt-4" />}
            </div>
          </motion.div>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2" role="tablist" aria-label="Featured signal">
        {deck.map((s, i) => (
          <button key={s.id} type="button" role="tab" aria-selected={i === active} aria-label={`Show signal ${i + 1}`} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-primary" : "w-3 bg-foreground/25 hover:bg-foreground/50"}`} />
        ))}
      </div>
    </div>
  );
}

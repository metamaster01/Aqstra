"use client";

import { useState } from "react";
import type { Scope, Story } from "@/lib/news/types";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { SignalMix } from "./signal-mix";
import { StoryCard } from "./story-card";

const COLUMNS: { scope: Scope; title: string; blurb: string }[] = [
  { scope: "india", title: "India", blurb: "Policy, production, markets and growth at home" },
  { scope: "global", title: "Global", blurb: "Americas, Europe, Asia-Pacific and world trade" },
];

/** Two columns side by side on desktop; a tab switch on phones. */
export function IndiaVsGlobal({ india, global }: { india: Story[]; global: Story[] }) {
  const [tab, setTab] = useState<Scope>("india");
  const data: Record<Scope, Story[]> = { india, global };

  return (
    <section aria-labelledby="ivg-title" className="py-16">
      <SectionHeading id="ivg-title" eyebrow="India vs Global" title="Two markets, one view" blurb="What's moving at home next to what's moving abroad. The bars show which kinds of signals dominate each side." />

      <div role="tablist" aria-label="Market" className="mb-6 flex gap-2 md:hidden">
        {COLUMNS.map((c) => (
          <button key={c.scope} role="tab" type="button" aria-selected={tab === c.scope} onClick={() => setTab(c.scope)}
            className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${tab === c.scope ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted"}`}>
            {c.title}
          </button>
        ))}
      </div>

      <div className="relative grid gap-10 md:grid-cols-2 md:gap-14">
        <div aria-hidden className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent md:block" />
        <div aria-hidden className="absolute left-1/2 top-6 z-10 hidden -translate-x-1/2 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-bold tracking-widest text-muted md:block">VS</div>

        {COLUMNS.map((c) => (
          <div key={c.scope} className={`${tab === c.scope ? "block" : "hidden"} min-w-0 md:block`}>
            <Reveal>
              <div className="mb-5">
                <div className="mb-1 flex items-baseline gap-3">
                  <h3 className="font-display text-2xl font-extrabold">{c.title}</h3>
                  <span className="text-sm text-muted">{data[c.scope].length} recent</span>
                </div>
                <p className="mb-4 text-sm text-muted">{c.blurb}</p>
                <SignalMix stories={data[c.scope]} />
              </div>
            </Reveal>
            <div className="space-y-4">
              {data[c.scope].slice(0, 4).map((s, i) => (
                <Reveal key={s.id} delay={i * 0.06} y={16}><StoryCard story={s} variant="compact" /></Reveal>
              ))}
              {data[c.scope].length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">Nothing new here yet.</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

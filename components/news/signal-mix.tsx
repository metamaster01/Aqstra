"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Story } from "@/lib/news/types";
import { signalMeta } from "./signals";

/** A stacked bar of which kinds of signals dominate a set of stories. */
export function SignalMix({ stories }: { stories: Story[] }) {
  const reduce = useReducedMotion();
  const counts = new Map<string, number>();
  for (const s of stories) counts.set(s.signal_type, (counts.get(s.signal_type) ?? 0) + 1);
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const total = rows.reduce((n, [, c]) => n + c, 0);
  if (!total) return null;

  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-foreground/10" role="img" aria-label={rows.map(([k, c]) => `${signalMeta(k).label} ${c}`).join(", ")}>
        {rows.map(([k, c], i) => (
          <motion.div
            key={k}
            className={`${signalMeta(k).bar} h-full`}
            style={{ width: `${(c / total) * 100}%`, transformOrigin: "left" }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        {rows.map(([k, c]) => (
          <li key={k} className="inline-flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${signalMeta(k).bar}`} aria-hidden />
            {signalMeta(k).label} <span className="font-semibold text-foreground">{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

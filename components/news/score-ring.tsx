"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Impact score as a ring that draws itself when it scrolls into view. */
export function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const reduce = useReducedMotion();
  const r = 15;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(10, score)) / 10;
  const tone = score >= 8 ? "text-emerald-500" : score >= 7 ? "text-sky-500" : "text-amber-500";
  return (
    <svg role="img" aria-label={`Impact score ${score} out of 10`} viewBox="0 0 36 36" width={size} height={size} className={`shrink-0 ${tone}`}>
      <title>{`Impact ${score}/10`}</title>
      <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" className="stroke-foreground/10" />
      <motion.circle
        cx="18" cy="18" r={r} fill="none" strokeWidth="3" strokeLinecap="round" stroke="currentColor"
        strokeDasharray={c} transform="rotate(-90 18 18)"
        initial={{ strokeDashoffset: reduce ? c * (1 - pct) : c }}
        whileInView={{ strokeDashoffset: c * (1 - pct) }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="18" y="18" textAnchor="middle" dominantBaseline="central" className="fill-foreground text-[11px] font-bold">{score}</text>
    </svg>
  );
}

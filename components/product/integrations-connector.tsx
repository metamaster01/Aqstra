"use client";

import { motion } from "framer-motion";
import { AIEngineMark } from "@/components/product/ai-engine-mark";

/**
 * AQSTRA root node with wavy "thread" connections dropping into the
 * integration cards below — showing AQSTRA integrating out to each platform,
 * rather than (as in the earlier version of this file) feeding generic
 * capability cards. Lives in the Integrations section now, not Platform
 * Capabilities.
 *
 * Coordinates are percentage-space (viewBox 0 0 100 H), same reasoning as
 * before: a percentage x-position lands on the right column center
 * regardless of actual rendered width, which is what makes this safe on top
 * of a responsive grid. The Integrations grid has THREE breakpoints
 * (grid-cols-2 → sm:grid-cols-3 → lg:grid-cols-6), so three thread variants
 * are rendered and swapped with the matching Tailwind responsive classes.
 *
 * Lines are now gentle S-curves (quadratic/cubic beziers) instead of
 * straight verticals/horizontals, per the "should look like a wave" request.
 */
export function IntegrationsConnector() {
  return (
    <div className="relative mx-auto mt-6 max-w-[900px]">
      <div className="relative z-10 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary to-[#1d4ed8] px-4 py-2 text-white shadow-[0_14px_30px_-12px_rgba(37,99,235,.55)]">
          <AIEngineMark className="size-4" />
          <span className="text-[12px] font-extrabold tracking-wide">AQSTRA</span>
        </div>
      </div>

      <WaveThreads columns={2} className="sm:hidden" />
      <WaveThreads columns={3} className="hidden sm:block lg:hidden" />
      <WaveThreads columns={6} className="hidden lg:block" />
    </div>
  );
}

function columnCenters(n: number) {
  // centers of n equal columns across 0–100, e.g. n=3 -> [16.67, 50, 83.33]
  return Array.from({ length: n }, (_, i) => ((2 * i + 1) / (2 * n)) * 100);
}

/** Gentle sine-like wave strung through the column anchor points. */
function wavyBar(xs: number[], y: number, amp = 2.6) {
  let d = `M ${xs[0]},${y}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const midX = (xs[i] + xs[i + 1]) / 2;
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` Q ${midX},${y + dir * amp} ${xs[i + 1]},${y}`;
  }
  return d;
}

/** S-curve drop from the wave bar down to a node, instead of a straight line. */
function wavyDrop(x: number, y1: number, y2: number) {
  const midY = (y1 + y2) / 2;
  return `M ${x},${y1} C ${x - 3.2},${midY - 4} ${x + 3.2},${midY + 4} ${x},${y2}`;
}

function WaveThreads({ columns, className }: { columns: 2 | 3 | 6; className?: string }) {
  const xs = columnCenters(columns);
  const barY = 14;
  const dropEndY = 38;

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`h-10 w-full sm:h-12 ${className ?? ""}`}
      aria-hidden
    >
      {/* wavy stem, root node → distribution wave */}
      <path d="M 50,0 C 46,5 54,9 50,14" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-border" />
      {/* wavy horizontal distribution line */}
      <path d={wavyBar(xs, barY)} fill="none" stroke="currentColor" strokeWidth="0.6" className="text-border" />

      {xs.map((x, i) => (
        <g key={i}>
          <path d={wavyDrop(x, barY, dropEndY)} fill="none" stroke="currentColor" strokeWidth="0.6" className="text-white/15" />
          <motion.path
            d={wavyDrop(x, barY, dropEndY)}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="2.5 5"
            className="text-primary"
            animate={{ strokeDashoffset: [0, -15] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "linear", delay: i * 0.12 }}
          />
          <circle cx={x} cy={dropEndY} r="1.4" fill="currentColor" className="text-primary" />
        </g>
      ))}
    </svg>
  );
}

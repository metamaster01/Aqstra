"use client";

import { motion } from "framer-motion";
import { AIEngineMark } from "@/components/product/ai-engine-mark";

/**
 * AQSTRA root node + "thread" connector lines dropping down into the
 * capability cards grid below it — same curved/flowing-dash technique as
 * DataFlowSection, but using percentage-space coordinates (viewBox 0 0 100 H)
 * instead of fixed pixel ones. That's what makes this safe to use on top of
 * a *responsive* CSS grid: a percentage x-position always lands on the right
 * column center no matter the actual rendered width, which a fixed-pixel
 * viewBox (fine for DataFlowSection's one static desktop layout) can't do
 * across a 2-col ↔ 3-col breakpoint change.
 *
 * Two variants are rendered and toggled with Tailwind's responsive display
 * classes — not computed from one dynamic column count — because the number
 * of drop-lines (2 vs 3) and their x-positions genuinely differ between
 * breakpoints; CSS alone can't read "current grid column count" to drive SVG
 * path data, so this is the same split-at-the-breakpoint approach used for
 * DataFlowSection's desktop/mobile diagrams.
 */
export function CapabilityConnector() {
  return (
    <div className="relative mx-auto mt-6 max-w-[760px]">
      {/* AQSTRA root node */}
      <div className="relative z-10 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary to-[#1d4ed8] px-4 py-2 text-white shadow-[0_14px_30px_-12px_rgba(37,99,235,.55)]">
          <AIEngineMark className="size-4" />
          <span className="text-[12px] font-extrabold tracking-wide">AQSTRA</span>
        </div>
      </div>

      <Threads columns={2} className="sm:hidden" />
      <Threads columns={3} className="hidden sm:block" />
    </div>
  );
}

function Threads({ columns, className }: { columns: 2 | 3; className?: string }) {
  const xs = columns === 2 ? [25, 75] : [100 / 6, 50, 500 / 6];

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`h-10 w-full sm:h-12 ${className ?? ""}`}
      aria-hidden
    >
      {/* stem from root node down to the horizontal bar */}
      <line x1="50" y1="0" x2="50" y2="14" stroke="currentColor" strokeWidth="0.6" className="text-border" />
      {/* horizontal distribution bar */}
      <line x1={xs[0]} y1="14" x2={xs[xs.length - 1]} y2="14" stroke="currentColor" strokeWidth="0.6" className="text-border" />

      {xs.map((x, i) => (
        <g key={i}>
          <line x1={x} y1="14" x2={x} y2="38" stroke="currentColor" strokeWidth="0.6" className="text-white/15" />
          <motion.line
            x1={x} y1="14" x2={x} y2="38"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="2.5 5"
            className="text-primary"
            animate={{ strokeDashoffset: [0, -15] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
          />
          <circle cx={x} cy="38" r="1.4" fill="currentColor" className="text-primary" />
        </g>
      ))}
    </svg>
  );
}

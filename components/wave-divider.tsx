"use client";

import { motion } from "framer-motion";

/**
 * A soft decorative seam between CtaSection and FooterSection. Both of those
 * are already the same solid #0a0e1a, so this isn't covering a color change —
 * it's replacing what was a flat straight border (which read as "two boxes
 * stacked") with a gentle wave motif in the same flowing-line language used
 * in DataFlowSection, so the whole stretch reads as one continuous panel.
 *
 * Renders as its own full-bleed strip directly between the two sections;
 * background matches them exactly so there's no visible seam at all, just
 * the wave line floating across it.
 */
export function WaveDivider() {
  return (
    <div className="relative h-14 overflow-hidden bg-[#0a0e1a] sm:h-20" aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* faint static wave, always visible */}
        <path
          d="M0,40 C 240,4 480,76 720,40 C 960,4 1200,76 1440,40"
          fill="none"
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="1.5"
        />
        {/* flowing accent wave, same marching-dash technique as the data-flow connectors */}
        <motion.path
          d="M0,40 C 240,4 480,76 720,40 C 960,4 1200,76 1440,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 26"
          className="text-primary/70"
          animate={{ strokeDashoffset: [0, -72] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

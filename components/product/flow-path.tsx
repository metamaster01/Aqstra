"use client";

import { motion } from "framer-motion";

/**
 * Shared "connector line with a flowing dash animation" used by both
 * DataFlowSection and IntegrationsDiagram — a faint static path plus an
 * animated marching-dash path drawn on top of it, both using whatever `d`
 * (bezier path) is passed in. Pulled out so both diagrams stay visually
 * identical instead of two copies drifting apart.
 */
export function FlowPath({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
      <motion.path
        d={d}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="7 16"
        className="text-primary"
        stroke="currentColor"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        animate={{ strokeDashoffset: [0, -46] }}
        transition={{
          opacity: { duration: 0.4, delay },
          strokeDashoffset: { duration: 1.4, repeat: Infinity, ease: "linear", delay },
        }}
      />
    </g>
  );
}

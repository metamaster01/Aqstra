"use client";

import { motion } from "framer-motion";
import { FlowPath } from "@/components/product/flow-path";

/**
 * Same colored-letter-badge technique as DataFlowSection's source nodes
 * (lucide doesn't ship these brand glyphs) — kept here rather than imported
 * from IntegrationsSection so this file has no dependency on it (the plain
 * grid in IntegrationsSection is only the mobile fallback now; this diagram
 * is the real desktop version).
 */
const PLATFORMS = [
  { id: "google", name: "Google Ads", mark: "G", bg: "#4285F4" },
  { id: "linkedin", name: "LinkedIn", mark: "in", bg: "#0A66C2" },
  { id: "facebook", name: "Facebook", mark: "f", bg: "#1877F2" },
  { id: "meta", name: "Meta Lead Ads", mark: "M", bg: "#7B4EE0" },
  { id: "hubspot", name: "HubSpot", mark: "H", bg: "#FF7A59" },
  { id: "slack", name: "Slack", mark: "S", bg: "#611F69" },
];

// Taller canvas than the original attempt, per the "increase the height"
// request. AQSTRA sits near the top; the six platforms fan out underneath
// it — i.e. DataFlowSection's left→center→right layout rotated 90°, with
// the curves flipped to flow top-to-bottom ("upside down" relative to that
// section's sideways orientation) instead of the flat wavy-bar used before.
const VB_W = 1080;
const VB_H = 560;
const CENTER = { x: VB_W / 2, y: 110 };
const NODE_Y = 470;
const nodeXs = [90, 276, 462, 618, 804, 990];

/** Vertical counterpart of DataFlowSection's bezier() — same idea, with the
 *  control-point offset applied on the Y axis instead of X, so curves leave
 *  the center node heading straight down before bending out to each side. */
function verticalBezier(x1: number, y1: number, x2: number, y2: number) {
  const dy = (y2 - y1) * 0.55;
  return `M ${x1},${y1} C ${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
}

export function IntegrationsDiagram() {
  return (
    <div className="relative mx-auto hidden max-w-[1080px] lg:block" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {nodeXs.map((x, i) => (
          <FlowPath key={PLATFORMS[i].id} d={verticalBezier(CENTER.x, CENTER.y + 58, x, NODE_Y)} delay={i * 0.12} />
        ))}
      </svg>

      {/* AQSTRA root node — plain wordmark, no engine icon/subtitle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(CENTER.x / VB_W) * 100}%`, top: `${(CENTER.y / VB_H) * 100}%` }}
      >
        <div className="relative flex size-[108px] items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex size-[92px] items-center justify-center rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary to-[#1d4ed8] text-white shadow-[0_20px_40px_-14px_rgba(37,99,235,.55)]">
            <span className="font-display text-[17px] font-extrabold tracking-tight">AQSTRA</span>
          </div>
        </div>
      </motion.div>

      {/* platform nodes */}
      {PLATFORMS.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(nodeXs[i] / VB_W) * 100}%`, top: `${(NODE_Y / VB_H) * 100}%` }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="flex size-14 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-[0_10px_25px_-10px_rgba(15,23,42,.35)]"
              style={{ backgroundColor: p.bg }}
            >
              {p.mark}
            </span>
            <span className="whitespace-nowrap text-[12px] font-medium text-muted">{p.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

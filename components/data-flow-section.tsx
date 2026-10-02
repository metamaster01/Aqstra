"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { BarChart3, Send, Users, type LucideIcon } from "lucide-react";

/**
 * Animated node-network diagram: raw lead sources on the left flow into a
 * central AI engine, which fans out qualified leads to different teams /
 * channels on the right. Desktop+ (lg) renders the full curved-connector
 * diagram with a continuous flowing-dash animation along each path; below
 * that it collapses to a simpler stacked flow (see MobileFlow) since the
 * precise node/curve layout doesn't hold up on narrow screens.
 *
 * ICON NOTE: lucide-react doesn't ship Google/LinkedIn/Facebook/Meta glyphs
 * (brand icons were dropped from the library), so the four source nodes are
 * solid-color letter badges (G / in / f / M) — the same avatar-badge style
 * already used elsewhere on this site (the "JC" contact avatar, company
 * initials in the Lead Discovery mockup), just in each platform's brand
 * color. This needs no new dependency and matches the site's existing visual
 * language. If you'd rather show the exact official logos, grab the SVGs
 * from each platform's brand/press kit and swap them into <SourceBadge />
 * below — everything else (layout, animation) stays the same.
 */

interface BrandSource {
  id: string;
  letter: string;
  bg: string; // hex
  label: string;
}

interface ConceptDest {
  id: string;
  icon: LucideIcon;
  label: string;
}

const SOURCES: BrandSource[] = [
  { id: "google", letter: "G", bg: "#4285F4", label: "Google Ads" },
  { id: "linkedin", letter: "in", bg: "#0A66C2", label: "LinkedIn" },
  { id: "facebook", letter: "f", bg: "#1877F2", label: "Facebook" },
  { id: "meta", letter: "M", bg: "#7B4EE0", label: "Meta Lead Ads" },
];

const DESTINATIONS: ConceptDest[] = [
  { id: "sales", icon: Users, label: "Sales Team" },
  { id: "outreach", icon: Send, label: "Outreach" },
  { id: "reporting", icon: BarChart3, label: "Reporting" },
];

// Shared coordinate space for the desktop diagram (viewBox units == px at 1:1 scale reference).
// Widened + given more vertical room so the larger badges/icons below have space to breathe.
const VB_W = 1080;
const VB_H = 460;
const CENTER = { x: VB_W / 2, y: VB_H / 2 };
const SOURCE_X = 130;
const DEST_X = VB_W - 130;

const sourceYs = [60, 180, 300, 410];
const destYs = [115, 230, 345];

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) * 0.55;
  return `M ${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

export function DataFlowSection() {
  const gradId = useId();

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[600px] text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 font-display text-[28px] font-bold leading-[1.25] tracking-[-0.02em] sm:text-[36px]"
          >
            Not more leads. Better leads.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mx-auto mt-4 max-w-[480px] text-[14px] leading-[1.75] text-muted"
          >
            Raw signals pour in from every channel you advertise on. MetaMaster's engine classifies, filters and
            prioritizes them in real time — then routes clean, qualified leads straight to the team that should act on them.
          </motion.p>
        </div>

        {/* Desktop / large tablet: full animated node diagram */}
        <div className="relative mx-auto mt-14 hidden max-w-[1080px] lg:block">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                <stop offset="1" stopColor="currentColor" stopOpacity="1" />
              </linearGradient>
            </defs>

            {SOURCES.map((s, i) => {
              const d = bezier(SOURCE_X, sourceYs[i], CENTER.x - 62, CENTER.y);
              return <FlowPath key={s.id} d={d} delay={i * 0.15} />;
            })}
            {DESTINATIONS.map((s, i) => {
              const d = bezier(CENTER.x + 62, CENTER.y, DEST_X, destYs[i]);
              return <FlowPath key={s.id} d={d} delay={0.6 + i * 0.15} />;
            })}
          </svg>

          {/* nodes sit above the SVG, positioned with the same coordinate space as % of container */}
          <div className="relative" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
            {SOURCES.map((s, i) => (
              <SourceNodeEl key={s.id} node={s} x={SOURCE_X} y={sourceYs[i]} delay={i * 0.08} />
            ))}
            {DESTINATIONS.map((s, i) => (
              <DestNodeEl key={s.id} node={s} x={DEST_X} y={destYs[i]} delay={0.5 + i * 0.08} />
            ))}

            {/* center AI engine node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "backOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(CENTER.x / VB_W) * 100}%`, top: `${(CENTER.y / VB_H) * 100}%` }}
            >
              <div className="relative flex size-[140px] items-center justify-center">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex size-[122px] flex-col items-center justify-center gap-1.5 rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary to-[#1d4ed8] text-white shadow-[0_20px_40px_-14px_rgba(37,99,235,.55)]">
                  <AIEngineMark className="size-9" />
                  <span className="text-center text-[11px] font-extrabold leading-tight tracking-tight">AQSTRA</span>
                  <span className="text-[8.5px] font-semibold uppercase leading-none tracking-[0.06em] opacity-85">AI Engine</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile / tablet: simplified vertical flow */}
        <MobileFlow />
      </div>
    </section>
  );
}

/**
 * Custom "compute / AI engine" mark — a central chip node with a small
 * neural-network of connections radiating out to satellite nodes. Built as
 * plain inline SVG (fill="currentColor", so it inherits the white text color
 * of its gradient badge) rather than pulled from an icon library, since this
 * is meant to read as AQSTRA's own engine mark, not a generic glyph.
 */
function AIEngineMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* primary connections, chip → outer nodes */}
      <path
        d="M20 20 L20 7 M20 20 L33 20 M20 20 L20 33 M20 20 L7 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* secondary diagonal connections for a denser network feel */}
      <path
        d="M20 20 L29.2 10.8 M20 20 L29.2 29.2 M20 20 L10.8 29.2 M20 20 L10.8 10.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* outer satellite nodes */}
      <circle cx="20" cy="7" r="2.6" fill="currentColor" />
      <circle cx="33" cy="20" r="2.6" fill="currentColor" />
      <circle cx="20" cy="33" r="2.6" fill="currentColor" />
      <circle cx="7" cy="20" r="2.6" fill="currentColor" />
      <circle cx="29.2" cy="10.8" r="1.8" fill="currentColor" opacity="0.75" />
      <circle cx="29.2" cy="29.2" r="1.8" fill="currentColor" opacity="0.75" />
      <circle cx="10.8" cy="29.2" r="1.8" fill="currentColor" opacity="0.75" />
      <circle cx="10.8" cy="10.8" r="1.8" fill="currentColor" opacity="0.75" />
      {/* center chip */}
      <rect x="14.5" y="14.5" width="11" height="11" rx="3" fill="currentColor" />
    </svg>
  );
}

function FlowPath({ d, delay }: { d: string; delay: number }) {
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

/** Solid-color letter badge for brand sources — see ICON NOTE above. */
function SourceBadge({ node, size = 64 }: { node: BrandSource; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-[0_10px_20px_-8px_rgba(15,23,42,.35)]"
      style={{ width: size, height: size, backgroundColor: node.bg, fontSize: size * 0.34 }}
    >
      {node.letter}
    </span>
  );
}

function SourceNodeEl({ node, x, y, delay }: { node: BrandSource; x: number; y: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
    >
      <div className="flex flex-col items-center gap-2">
        <SourceBadge node={node} size={64} />
        <span className="whitespace-nowrap text-[11.5px] font-medium text-muted">{node.label}</span>
      </div>
    </motion.div>
  );
}

function DestNodeEl({ node, x, y, delay }: { node: ConceptDest; x: number; y: number; delay: number }) {
  const Icon = node.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="flex size-16 items-center justify-center rounded-full border-2 border-border bg-card shadow-[0_10px_25px_-10px_rgba(15,23,42,.3)]">
          <Icon className="size-7 text-primary" strokeWidth={2} />
        </span>
        <span className="whitespace-nowrap text-[11.5px] font-medium text-muted">{node.label}</span>
      </div>
    </motion.div>
  );
}

function MobileFlow() {
  return (
    <div className="mt-12 flex flex-col items-center gap-3 lg:hidden">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SOURCES.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-1.5"
          >
            <SourceBadge node={s} size={56} />
            <span className="text-[10.5px] font-medium text-muted">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <FlowArrowDown />

      <div className="relative flex size-24 items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex size-[88px] flex-col items-center justify-center gap-1 rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary to-[#1d4ed8] text-white shadow-[0_16px_30px_-12px_rgba(37,99,235,.55)]">
          <AIEngineMark className="size-6" />
          <span className="text-[9px] font-extrabold leading-tight">AQSTRA</span>
          <span className="text-[7px] font-semibold uppercase leading-none tracking-[0.05em] opacity-85">AI Engine</span>
        </div>
      </div>

      <FlowArrowDown />

      <div className="flex flex-wrap items-center justify-center gap-3">
        {DESTINATIONS.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="flex size-14 items-center justify-center rounded-full border-2 border-border bg-card shadow-sm">
                <Icon className="size-6 text-primary" strokeWidth={2} />
              </span>
              <span className="text-[10.5px] font-medium text-muted">{s.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FlowArrowDown() {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" aria-hidden>
      <line x1="10" y1="0" x2="10" y2="18" stroke="currentColor" strokeWidth="2" className="text-border" />
      <motion.line
        x1="10" y1="0" x2="10" y2="18"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="5 8"
        className="text-primary"
        animate={{ strokeDashoffset: [0, -26] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
      <path d="M4 18 L10 26 L16 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-border" />
    </svg>
  );
}
"use client";

import { motion } from "framer-motion";
import { CheckCheck, Filter, FolderOpen, Search, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  label: string;
  tone: "blue" | "lime";
}

const steps: Step[] = [
  { icon: Search, label: "Discover", tone: "blue" },
  { icon: FolderOpen, label: "Classify", tone: "lime" },
  { icon: Filter, label: "Filter", tone: "blue" },
  { icon: CheckCheck, label: "Qualify", tone: "lime" },
  { icon: Send, label: "Outreach", tone: "blue" },
];

const tones: Record<Step["tone"], string> = {
  blue: "bg-primary text-white",
  lime: "bg-[#d4f57e] text-[#2b3a0a]",
};

export function ProcessSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-[900px] px-6 text-center sm:px-10 lg:px-20">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[560px] font-display text-[28px] font-bold leading-[1.25] tracking-[-0.02em] sm:text-[36px]"
        >
          From lead discovery to outreach, without the noise.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-[520px] text-[14.5px] leading-[1.75] text-muted"
        >
          Instead of giving your team massive, unfiltered contact lists, MetaMaster helps create a focused shortlist of prospects that actually match your requirements.
        </motion.p>

        {/* Desktop / tablet: horizontal row with drawing connector line */}
        <div className="relative mx-auto mt-16 hidden max-w-[640px] items-start justify-between sm:flex">
          <ConnectorLine />
          {steps.map((step, i) => (
            <StepItem key={step.label} step={step} index={i} />
          ))}
        </div>

        {/* Mobile: vertical list with drawing connector line */}
        <div className="relative mx-auto mt-14 flex max-w-[220px] flex-col items-center gap-10 sm:hidden">
          <VerticalConnectorLine />
          {steps.map((step, i) => (
            <StepItem key={step.label} step={step} index={i} vertical />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ step, index, vertical }: { step: Step; index: number; vertical?: boolean }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: vertical ? 0 : 16, scale: 0.7 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay: 0.35 + index * 0.22, ease: "backOut" }}
      className="relative z-10 flex flex-col items-center gap-2.5 bg-background px-1"
    >
      <motion.span
        whileHover={{ scale: 1.08, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={`flex size-11 items-center justify-center rounded-xl shadow-[0_10px_20px_-8px_rgba(37,99,235,.35)] sm:size-12 ${tones[step.tone]}`}
      >
        <Icon className="size-5" strokeWidth={2.25} />
      </motion.span>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground/90">{step.label}</span>
    </motion.div>
  );
}

function ConnectorLine() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 640 2"
      preserveAspectRatio="none"
      className="absolute left-0 right-0 top-[22px] z-0 h-[2px] w-full sm:top-[24px]"
    >
      <motion.line
        x1="24" y1="1" x2="616" y2="1"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 6"
        className="text-border"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
      />
    </svg>
  );
}

function VerticalConnectorLine() {
  return (
    <svg aria-hidden viewBox="0 0 2 400" preserveAspectRatio="none" className="absolute left-1/2 top-0 z-0 h-full w-[2px] -translate-x-1/2">
      <motion.line
        x1="1" y1="24" x2="1" y2="376"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 6"
        className="text-border"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

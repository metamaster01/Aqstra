"use client";

/**
 * Two sections: <Workflow /> ("One connected workflow.") and
 * <Precision /> ("Built around precision.").
 *
 * Uses the same tokens as your Hero (bg-background, text-muted, border-border,
 * bg-card, text-primary) plus `dark:` variants, so both themes follow your
 * existing theme logic. Needs: framer-motion, lucide-react.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BadgeCheck, Check, Folder, Send, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

function useReveal() {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: reduce ? 0 : 0.1 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
  return { reduce, container, item };
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  const { reduce } = useReveal();
  return (
    <motion.h2
      id={id}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE }}
      className="text-center font-display font-extrabold text-foreground"
      // inline: a global h2 rule in the site CSS can override utility font sizes
      style={{ fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0 }}
    >
      {children}
    </motion.h2>
  );
}

/* ───────────────────────── One connected workflow ───────────────────────── */

const STEPS = [
  { n: "01", title: "Discover", text: "Find prospects matching your target criteria." },
  { n: "02", title: "Classify", text: "Organize prospects based on relevance." },
  { n: "03", title: "Filter", text: "Remove unwanted or irrelevant leads." },
  { n: "04", title: "Qualify", text: "Build a focused shortlist." },
  { n: "05", title: "Activate", text: "Use qualified leads in structured outreach campaigns." },
];

export function Workflow() {
  const { reduce, container, item } = useReveal();

  return (
    <section aria-labelledby="workflow-title" className="bg-background px-6 py-16 sm:px-10 sm:py-24 lg:px-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle id="workflow-title">One connected workflow.</SectionTitle>

        <div className="relative mt-12 md:mt-16">
          {/* connector: vertical on mobile, horizontal from first to last circle on md+ */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute bottom-6 left-6 top-6 w-px origin-top bg-primary/40 md:hidden"
          />
          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute left-[10%] right-[10%] top-6 hidden h-px origin-left bg-primary/40 md:block"
          />

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="relative grid gap-9 md:grid-cols-5 md:gap-4"
          >
            {STEPS.map((s) => (
              <motion.li
                key={s.n}
                variants={item}
                className="flex items-start gap-5 md:flex-col md:items-center md:gap-4 md:text-center"
              >
                <span
                  aria-hidden
                  className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-primary bg-background text-sm font-semibold text-foreground"
                >
                  {s.n}
                </span>
                <div className="pt-1 md:pt-0">
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.08em] text-foreground">{s.title}</h3>
                  <p className="mt-1.5 max-w-[240px] text-[13px] leading-relaxed text-muted md:mx-auto md:max-w-[170px]">
                    {s.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Built around precision ───────────────────────── */

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Check, title: "Less Manual Research", text: "Spend less time working through large prospect lists." },
  { icon: BadgeCheck, title: "Better Lead Quality", text: "Focus on prospects that better match your requirements." },
  { icon: Folder, title: "Clearer Workflows", text: "Move smoothly from lead discovery to campaign activation." },
  { icon: Send, title: "Designed for Growth", text: "Create a repeatable process for prospecting and outreach." },
];

export function Precision() {
  const { container, item } = useReveal();

  return (
    <section aria-labelledby="precision-title" className="bg-background px-6 pb-20 pt-4 sm:px-10 sm:pb-28 lg:px-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle id="precision-title">Built around precision.</SectionTitle>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4"
        >
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <motion.li
              key={title}
              variants={item}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary dark:border-white/25 dark:bg-white/[0.03] dark:hover:border-primary sm:p-7"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#dbe8ff] text-primary">
                <Icon className="size-[18px]" strokeWidth={2.2} aria-hidden />
              </span>
              <h3 className="mt-5 text-[15px] font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{text}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

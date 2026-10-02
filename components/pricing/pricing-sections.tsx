"use client";

/**
 * Pricing page sections:
 *  - <PricingPlans /> header + monthly/annual toggle + 3 plan cards
 *  - <ComparePlans /> feature comparison table
 *  - <PricingFaq />   FAQ accordion
 *
 * Same tokens as your Hero (bg-background, text-foreground, text-muted,
 * border-border, bg-card, text-primary, primary-foreground) plus `dark:`
 * variants, so both themes follow your existing theme logic.
 * Needs: framer-motion, lucide-react, next/link.
 */

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Minus } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-60px" } as const;

// Inline font sizes: a global h1/h2 rule in the site CSS can override utility classes.
const h1Style = { fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.035em", margin: 0 } as const;
const h2Style = { fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0 } as const;

function useReveal() {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.05 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
  return { reduce, container, item };
}

/* ───────────────────────────── Plans ───────────────────────────── */

const ANNUAL_DISCOUNT = 0.2;

type Plan = {
  id: string;
  name: string;
  blurb: string;
  monthly: number;
  unit: string;
  popular?: boolean;
  featuresTitle: string;
  features: { text: string; off?: boolean }[];
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "For individuals building their first qualified prospect lists.",
    monthly: 49,
    unit: "/ month",
    featuresTitle: "Everything in Starter:",
    features: [
      { text: "1,000 lead credits per month" },
      { text: "Lead discovery and search" },
      { text: "Basic lead filtering" },
      { text: "Email verification" },
      { text: "CRM integrations", off: true },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "For growing teams that need more precision and automation.",
    monthly: 149,
    unit: "/ user / month",
    popular: true,
    featuresTitle: "Everything in Starter, plus:",
    features: [
      { text: "5,000 lead credits per month" },
      { text: "Advanced classification and scoring" },
      { text: "Custom filters and saved searches" },
      { text: "CRM integrations" },
      { text: "Campaign tools and sequences" },
      { text: "Team collaboration" },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    blurb: "For revenue teams that need a complete lead intelligence platform.",
    monthly: 299,
    unit: "/ user / month",
    featuresTitle: "Everything in Growth, plus:",
    features: [
      { text: "15,000 lead credits per month" },
      { text: "Intent data and buying signals" },
      { text: "Advanced analytics and reporting" },
      { text: "Priority support" },
      { text: "Dedicated success manager" },
    ],
  },
];

function BillingToggle({ annual, onChange }: { annual: boolean; onChange: (v: boolean) => void }) {
  const label = (active: boolean) =>
    `cursor-pointer text-[13px] transition-colors ${active ? "font-semibold text-foreground" : "text-muted"}`;

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 shadow-[0_6px_20px_-10px_rgba(15,23,42,0.25)] dark:border-white/15">
      <span className={label(!annual)} onClick={() => onChange(false)}>
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={annual}
        aria-label="Bill annually"
        onClick={() => onChange(!annual)}
        className="relative h-6 w-11 shrink-0 rounded-full bg-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <motion.span
          aria-hidden
          animate={{ x: annual ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow"
        />
      </button>
      <span className={label(annual)} onClick={() => onChange(true)}>
        Annual
      </span>
      <span className="rounded-md bg-emerald-100 px-2 py-1 text-[10.5px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
        Save {ANNUAL_DISCOUNT * 100}%
      </span>
    </div>
  );
}

function Price({ value, reduce }: { value: number; reduce: boolean | null }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? false : { y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: -18, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="inline-block"
        >
          ${value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function PricingPlans() {
  const { reduce, container, item } = useReveal();
  const [annual, setAnnual] = useState(false);

  return (
    <section aria-labelledby="pricing-title" className="bg-background px-5 pb-16 pt-14 sm:px-10 sm:pb-24 sm:pt-20 lg:px-20">
      <div className="mx-auto max-w-[1040px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-[760px] text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-[#8fb0ff]">
            Simple, transparent pricing
          </p>
          <h1 id="pricing-title" className="font-display font-extrabold text-foreground" style={h1Style}>
            Choose the plan that fits your pipeline
          </h1>
          <p className="mx-auto mt-5 max-w-[460px] text-[15px] leading-relaxed text-muted sm:text-[17px]">
            Start with the tools you need today. Scale your lead intelligence as your team grows.
          </p>
          <div className="mt-8">
            <BillingToggle annual={annual} onChange={setAnnual} />
          </div>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mt-14 grid max-w-[480px] gap-6 sm:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-5"
        >
          {PLANS.map((p) => {
            const price = annual ? Math.round(p.monthly * (1 - ANNUAL_DISCOUNT)) : p.monthly;
            return (
              <motion.li key={p.id} variants={item} className="relative flex">
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div
                  className={`flex w-full flex-col rounded-2xl border bg-card p-6 transition-shadow sm:p-7 ${
                    p.popular
                      ? "border-primary shadow-[0_20px_50px_-20px_rgba(37,99,235,0.55)] dark:border-primary"
                      : "border-border hover:shadow-[0_18px_40px_-26px_rgba(15,23,42,0.4)] dark:border-white/15 dark:bg-white/[0.03]"
                  } ${p.popular ? "dark:bg-white/[0.05]" : ""}`}
                >
                  <h2 className="font-display text-[20px] font-bold text-foreground" style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                    {p.name}
                  </h2>
                  <p className="mt-2 min-h-[42px] text-[13px] leading-relaxed text-muted">{p.blurb}</p>

                  <p className="mt-6 flex items-baseline gap-1.5 text-foreground">
                    <span className="font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] sm:text-[48px]">
                      <Price value={price} reduce={reduce} />
                    </span>
                    <span className="text-[13px] text-muted">{p.unit}</span>
                  </p>
                  <p className="mt-3 text-[12px] text-muted">
                    {annual
                      ? `Billed annually ($${(price * 12).toLocaleString()}/yr), cancel anytime.`
                      : "Billed monthly, cancel anytime."}
                  </p>

                  <Link
                    href={`/signup?plan=${p.id}`}
                    className={`group mt-6 inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[13.5px] font-semibold transition-all hover:-translate-y-0.5 ${
                      p.popular
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] hover:bg-primary-hover"
                        : "border-border bg-card text-foreground hover:border-primary dark:border-white/25 dark:bg-transparent"
                    }`}
                  >
                    Start Free Trial
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>

                  <div className="mt-6 flex-1 border-t border-border pt-6 dark:border-white/15">
                    <p className="text-[12px] font-bold text-foreground">{p.featuresTitle}</p>
                    <ul className="mt-4 space-y-3">
                      {p.features.map((f) => (
                        <li
                          key={f.text}
                          className={`flex items-start gap-2.5 text-[13px] leading-snug ${
                            f.off ? "text-muted/60" : "text-foreground/85"
                          }`}
                        >
                          <Check
                            className={`mt-0.5 size-4 shrink-0 ${
                              f.off ? "text-muted/40" : "text-emerald-500 dark:text-emerald-400"
                            }`}
                            strokeWidth={2.4}
                            aria-hidden
                          />
                          <span>
                            {f.text}
                            {f.off && <span className="sr-only"> (not included)</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── Compare plans ───────────────────────────── */

type Cell = boolean | string; // true = check, false = dash, string = text

const GROUPS: { title: string; rows: { label: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    title: "Lead Intelligence",
    rows: [
      { label: "Lead discovery and search", values: [true, true, true] },
      { label: "Lead credits per month", values: ["1,000", "5,000", "15,000"] },
      { label: "Data enrichment", values: [true, true, true] },
      { label: "Lead scoring and classification", values: [false, true, true] },
      { label: "Intent data and buying signals", values: [false, false, true] },
    ],
  },
  {
    title: "Workflow & Activation",
    rows: [
      { label: "Saved searches and filters", values: [false, true, true] },
      { label: "Campaign tools", values: [false, true, true] },
      { label: "CRM integrations", values: [false, true, true] },
      { label: "Advanced analytics", values: [false, false, true] },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Standard support", values: [true, true, true] },
      { label: "Priority support", values: [false, false, true] },
      { label: "Dedicated success manager", values: [false, false, true] },
    ],
  },
];

function CellView({ v }: { v: Cell }) {
  if (v === true)
    return (
      <>
        <Check className="mx-auto size-4 text-foreground" strokeWidth={2.4} aria-hidden />
        <span className="sr-only">Included</span>
      </>
    );
  if (v === false)
    return (
      <>
        <Minus className="mx-auto size-4 text-muted/50" aria-hidden />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span className="text-[12px] text-foreground sm:text-[13px]">{v}</span>;
}

export function ComparePlans() {
  const { reduce } = useReveal();

  return (
    <section aria-labelledby="compare-title" className="bg-background px-5 pb-16 pt-4 sm:px-10 sm:pb-24 lg:px-20">
      <div className="mx-auto max-w-[900px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <h2 id="compare-title" className="font-display font-extrabold text-foreground" style={h2Style}>
            Compare plans
          </h2>
          <p className="mt-3 text-[14px] text-muted sm:text-base">Find the plan with the capabilities your team needs.</p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-9 overflow-hidden rounded-2xl border border-border bg-card dark:border-white/15 sm:mt-12"
        >
          {/* table-fixed + compact type: fits a phone width without horizontal scrolling */}
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Feature comparison of the Starter, Growth and Scale plans</caption>
            <colgroup>
              <col className="w-[40%] sm:w-[46%]" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="bg-foreground/[0.03]">
                <th scope="col" className="px-3 py-4 text-[12px] font-semibold text-foreground sm:px-6 sm:text-[13px]">
                  Features
                </th>
                {["Starter", "Growth", "Scale"].map((n) => (
                  <th
                    key={n}
                    scope="col"
                    className="px-1 py-4 text-center text-[12px] font-semibold text-foreground sm:text-[13px]"
                  >
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            {GROUPS.map((g) => (
              <tbody key={g.title}>
                <tr className="border-t border-border bg-foreground/[0.04] dark:border-white/10">
                  <th
                    colSpan={4}
                    scope="colgroup"
                    className="px-3 py-3 text-[12px] font-semibold text-foreground sm:px-6 sm:text-[13px]"
                  >
                    {g.title}
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.label} className="border-t border-border dark:border-white/10">
                    <th
                      scope="row"
                      className="px-3 py-3.5 text-[12px] font-normal leading-snug text-muted sm:px-6 sm:py-4 sm:text-[13px]"
                    >
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className="px-1 py-3.5 text-center sm:py-4">
                        <CellView v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────── FAQ ───────────────────────────── */

const FAQS = [
  {
    q: "Can I try MetaMaster before I buy?",
    a: "Yes. Every plan includes a 14-day free trial, with no credit card required. You can explore lead discovery, filtering, and qualification before choosing a plan.",
  },
  {
    q: "What is a lead credit?",
    a: "A lead credit is used when you reveal or export a verified contact or company profile. Credits reset at the start of each billing cycle.",
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely. Upgrade, downgrade, or change your billing cadence at any time. Your new plan takes effect immediately when upgrading.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes. Annual subscriptions receive a 20% discount compared with monthly billing.",
  },
  {
    q: "What does Enterprise include?",
    a: "Enterprise provides custom credit allocations, advanced security and permissions, custom integrations, implementation support, and a dedicated success manager.",
  },
];

// Which questions start open. [0, 1, 2, 3, 4] matches the design (all open).
const OPEN_BY_DEFAULT = [0];

function FaqItem({ q, a, defaultOpen, variants }: { q: string; a: string; defaultOpen: boolean; variants: Variants }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <motion.li
      variants={variants}
      className="rounded-xl border border-border bg-card transition-colors hover:border-primary/40 dark:border-white/15 dark:bg-white/[0.03]"
    >
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-6"
        >
          <span className="text-[14px] font-semibold text-foreground sm:text-[15px]">{q}</span>
          <ChevronDown
            aria-hidden
            className={`size-4 shrink-0 text-primary transition-transform duration-300 dark:text-[#8fb0ff] ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-[13px] leading-relaxed text-muted sm:px-6 sm:text-[13.5px]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function PricingFaq() {
  const { reduce, container, item } = useReveal();

  return (
    <section aria-labelledby="faq-title" className="bg-foreground/[0.03] px-5 py-16 sm:px-10 sm:py-24 lg:px-20">
      <div className="mx-auto max-w-[760px]">
        <motion.h2
          id="faq-title"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center font-display font-extrabold text-foreground"
          style={h2Style}
        >
          Frequently asked questions
        </motion.h2>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-9 space-y-3 sm:mt-12"
        >
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={OPEN_BY_DEFAULT.includes(i)} variants={item} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

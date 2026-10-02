"use client";

/**
 * resource page sections:
 *  - <ResourceTypes />   "Explore by resource type"  (4 cards, 2 columns on mobile)
 *  - <Latestresource /> "Latest from MetaMaster"      (6 article cards)
 *
 * Same tokens as your Hero (bg-background, text-foreground, text-muted,
 * border-border, bg-card, text-primary) plus `dark:` variants, so both follow
 * your existing theme logic. Needs: framer-motion, lucide-react, next/link.
 *
 * Replace the `href` values with your real routes.
 */

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Book,
  Filter,
  LayoutTemplate,
  LineChart,
  PenLine,
  Search,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-60px" } as const;

function useReveal() {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.05 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
  return { reduce, container, item };
}

// Inline font sizes: a global h2 rule in the site CSS can override utility classes.
const h2Style = {
  fontSize: "clamp(26px, 3.4vw, 40px)",
  lineHeight: 1.12,
  letterSpacing: "-0.03em",
  margin: 0,
} as const;

const cardBase =
  "group block h-full rounded-2xl border border-border bg-card transition-all duration-300 " +
  "hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_40px_-24px_rgba(37,99,235,0.45)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary " +
  "dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-primary";

/* ───────────────────────── Explore by resource type ───────────────────────── */

const TYPES: { icon: LucideIcon; title: string; text: string; cta: string; href: string }[] = [
  {
    icon: Book,
    title: "Guides",
    text: "Detailed playbooks for more effective prospecting and outreach.",
    cta: "18 guides",
    href: "/resource/guides",
  },
  {
    icon: PenLine,
    title: "Insights",
    text: "Ideas and perspectives on sales intelligence and growth.",
    cta: "42 articles",
    href: "/resource/insights",
  },
  {
    icon: Video,
    title: "Webinars",
    text: "Watch experts share practical strategies and best practices.",
    cta: "9 sessions",
    href: "/resource/webinars",
  },
  {
    icon: LayoutTemplate,
    title: "Templates",
    text: "Ready-to-use frameworks for prospecting and outreach.",
    cta: "14 templates",
    href: "/resource/templates",
  },
];

export function ResourceTypes() {
  const { reduce, container, item } = useReveal();

  return (
    <section aria-labelledby="resource-types-title" className="bg-background px-5 py-14 sm:px-10 sm:py-20 lg:px-20">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-[560px] text-center"
        >
          <h2 id="resource-types-title" className="font-display font-extrabold text-foreground" style={h2Style}>
            Explore by resource type
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted sm:mt-4 sm:text-base">
            Go deeper with resources designed for every stage of your prospecting workflow.
          </p>
        </motion.div>

        {/* 2 columns on mobile, 4 on large screens */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4 lg:gap-5"
        >
          {TYPES.map(({ icon: Icon, title, text, cta, href }) => (
            <motion.li key={title} variants={item}>
              <Link href={href} className={`${cardBase} p-4 sm:p-6`}>
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#dbe8ff] text-primary sm:size-10 sm:rounded-xl">
                  <Icon className="size-[17px] sm:size-[18px]" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-foreground sm:mt-5 sm:text-base">{title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted sm:mt-2 sm:text-[13px]">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary dark:text-[#8fb0ff] sm:mt-5 sm:text-[13px]">
                  {cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Latest from MetaMaster ───────────────────────── */

type Post = {
  icon: LucideIcon;
  tag: string;
  title: string;
  text: string;
  read: string;
  date: string;
  href: string;
  // thumbnail gradient: light theme / dark theme
  thumb: string;
};

const POSTS: Post[] = [
  {
    icon: Search,
    tag: "Lead Discovery",
    title: "7 signals that indicate a prospect is ready to buy",
    text: "Learn which company and behavioral signals help you find in-market prospects.",
    read: "6 min read",
    date: "May 14",
    href: "/resource/prospect-ready-signals",
    thumb: "from-[#dbe8ff] to-[#b9d2fb] dark:from-[#1d3a8a]/60 dark:to-[#2563eb]/25",
  },
  {
    icon: BadgeCheck,
    tag: "Qualification",
    title: "Build a lead-scoring model your sales team will trust",
    text: "A step-by-step guide to defining what a qualified lead means for your business.",
    read: "9 min read",
    date: "May 8",
    href: "/resource/lead-scoring-model",
    thumb: "from-[#d3f7e4] to-[#a8f0cc] dark:from-[#0f5132]/60 dark:to-[#10b981]/20",
  },
  {
    icon: BarChart3,
    tag: "Sales Strategy",
    title: "How top teams create repeatable prospecting processes",
    text: "Turn successful outreach into a scalable system your whole team can follow.",
    read: "8 min read",
    date: "May 2",
    href: "/resource/repeatable-prospecting",
    thumb: "from-[#e0e5ff] to-[#c3cdfb] dark:from-[#312e81]/60 dark:to-[#6366f1]/25",
  },
  {
    icon: Filter,
    tag: "Outreach",
    title: "5 ways to make your cold outreach more relevant",
    text: "Practical ways to turn prospect intelligence into messages that get replies.",
    read: "5 min read",
    date: "Apr 26",
    href: "/resource/relevant-cold-outreach",
    thumb: "from-[#fdf1c0] to-[#fbe08a] dark:from-[#713f12]/60 dark:to-[#eab308]/20",
  },
  {
    icon: Users,
    tag: "Data Quality",
    title: "The hidden cost of outdated prospect data",
    text: "Why clean, verified data is the foundation of a high-performing sales pipeline.",
    read: "7 min read",
    date: "Apr 21",
    href: "/resource/outdated-prospect-data",
    thumb: "from-[#fde2f0] to-[#fbc8e2] dark:from-[#831843]/60 dark:to-[#ec4899]/20",
  },
  {
    icon: LineChart,
    tag: "Growth",
    title: "From raw data to revenue: the prospecting workflow",
    text: "See how a connected lead-intelligence process drives more focused growth.",
    read: "11 min read",
    date: "Apr 15",
    href: "/resource/data-to-revenue",
    thumb: "from-[#c9f6fc] to-[#a3eef8] dark:from-[#164e63]/60 dark:to-[#06b6d4]/20",
  },
];

export function LatestResources() {
  const { reduce, container, item } = useReveal();

  return (
    <section
      aria-labelledby="latest-title"
      className="bg-foreground/[0.03] px-5 py-14 sm:px-10 sm:py-20 lg:px-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2"
        >
          <h2 id="latest-title" className="font-display font-extrabold text-foreground" style={h2Style}>
            Latest from MetaMaster
          </h2>
          <Link
            href="/resource/all"
            className="group inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline dark:text-[#8fb0ff]"
          >
            Browse all resource
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {POSTS.map(({ icon: Icon, tag, title, text, read, date, href, thumb }) => (
            <motion.li key={title} variants={item}>
              <Link href={href} className={`${cardBase} overflow-hidden`}>
                <div className={`flex h-28 items-center justify-center bg-gradient-to-br sm:h-32 ${thumb}`}>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white/75 text-primary shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-white/10 dark:text-[#8fb0ff]">
                    <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                  </span>
                </div>

                <div className="p-5">
                  <span className="inline-block rounded-md bg-[#dbe8ff] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary dark:bg-primary/20 dark:text-[#9db8ff]">
                    {tag}
                  </span>
                  <h3 className="mt-3 line-clamp-2 text-[16px] font-bold leading-snug text-foreground">{title}</h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{text}</p>
                  <p className="mt-4 flex items-center gap-2 text-[12px] text-muted">
                    <span>{read}</span>
                    <span aria-hidden className="size-[3px] rounded-full bg-current opacity-60" />
                    <span>{date}</span>
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

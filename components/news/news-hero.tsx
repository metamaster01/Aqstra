"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { DEMO_URL } from "@/lib/news/config";
import type { Story } from "@/lib/news/types";
import { RelativeTime } from "./relative-time";
import { SignalStack } from "./signal-stack";

export function NewsHero({ deck, updatedAt, industryCount }: { deck: Story[]; updatedAt: string | null; industryCount: number }) {
  const reduce = useReducedMotion();
  const line = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-[#f3f6fb] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-24 left-[28%] h-[520px] w-[520px] rounded-full bg-[#3a3690]/45 blur-[120px]" />
          <div className="absolute left-[8%] top-[34%] h-[420px] w-[420px] rounded-full bg-[#9db06a]/45 blur-[130px]" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-14 sm:px-10 sm:py-20 lg:min-h-[620px] lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-14">
        <div className="max-w-[600px]">
          <motion.p {...line(0)} className="mb-5 text-[16px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-white">Industry News</motion.p>
          <h1 className="font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] min-[400px]:text-[38px] sm:text-[54px] lg:text-[60px]">
            <motion.span {...line(1)} className="block">The world moves.</motion.span>
            <motion.span {...line(2)} className="block">Know what to <span className="text-primary dark:text-[#9db6ff]">search</span></motion.span>
            <motion.span {...line(3)} className="block">next.</motion.span>
          </h1>
          <motion.p {...line(4)} className="mt-7 max-w-[500px] text-[17px] leading-[1.75] text-muted">
            We read global and Indian business news so you don't have to. Every story comes with why it matters and the exact searches to run on Aqstra.
          </motion.p>

          <motion.div {...line(5)} className="mt-9 flex flex-wrap gap-3">
            <a href="#featured" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover">
              See today's signals <ArrowDown className="size-4" />
            </a>
            <Link href={DEMO_URL} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary dark:border-foreground/70 dark:bg-transparent">
              Book a Free Demo <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          <motion.ul {...line(6)} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <li className="inline-flex items-center gap-2">
              <span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" /></span>
              <span>{updatedAt ? <>Updated <RelativeTime iso={updatedAt} /></> : "Updating every few hours"}</span>
            </li>
            <li>India · Americas · Europe · Asia-Pacific</li>
            {industryCount > 0 && <li>{industryCount} industries</li>}
          </motion.ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <SignalStack stories={deck} />
        </motion.div>
      </div>
    </section>
  );
}

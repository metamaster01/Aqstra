"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  const reduce = useReducedMotion();
  const line = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden">
      {/* backgrounds */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-[#f3f6fb] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-24 left-[28%] h-[520px] w-[520px] rounded-full bg-[#3a3690]/45 blur-[120px]" />
          <div className="absolute left-[18%] top-[28%] h-[460px] w-[460px] rounded-full bg-[#9db06a]/70 blur-[130px]" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-14 sm:px-10 sm:py-20 lg:min-h-[calc(100svh-58px)] lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:px-20 lg:py-16">
        <div className="max-w-[560px]">
          <motion.p {...line(0)} className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-white">
            The MetaMaster Platform
          </motion.p>

          <h1 className="font-display text-[44px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[56px] lg:text-[64px]">
            <motion.span {...line(1)} className="block">
              Find the right <span className="dark:text-[#cfd3ea]">leads.</span>
            </motion.span>
            <motion.span {...line(2)} className="block">Build smarter</motion.span>
            <motion.span {...line(3)} className="block">outreach.</motion.span>
          </h1>

          <motion.p {...line(4)} className="mt-7 max-w-[440px] text-[17px] leading-[1.75] text-muted">
            MetaMaster helps you discover, classify, and filter prospects for accuracy—then turn your qualified shortlist into structured outreach campaigns.
          </motion.p>

          <motion.div {...line(5)} className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#start"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Get Started <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary dark:border-foreground/70 dark:bg-transparent"
            >
              Book a Demo <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto hidden w-full max-w-[600px] lg:block lg:max-w-none"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Deliberately a dark navy panel regardless of the site's light/dark theme
 * toggle (same #0a0e1a used in StatsSection) — a fixed-dark CTA band right
 * above an always-dark footer is a common, intentional pattern and keeps
 * this component and FooterSection visually identical in both themes, which
 * is what was asked for, rather than needing separate light/dark variants.
 */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0e1a] py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[260px] w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[640px] px-6 text-center sm:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-white sm:text-[38px]"
        >
          Ready to find better leads?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-[440px] text-[14.5px] leading-[1.7] text-white/55"
        >
          Build focused prospect lists and turn lead intelligence into smarter outreach.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="#start"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            Get Started <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
          >
            Book a Demo <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

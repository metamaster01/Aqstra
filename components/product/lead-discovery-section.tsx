"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Expects /public/images/product-1.png (the Lead Discovery screenshot).
 * Single image, not theme-swapped — the screenshot is a white UI card, which
 * reads fine floating on both a light and a dark page background (same
 * approach as the light-theme hero mockup originally), so no dark variant
 * is needed here. Drop the file in at that path; nothing else to wire up.
 */
const CHECKLIST = [
  "Search by industry, company size, location, and technology stack",
  "Access real-time company and contact data",
  "Identify buying signals and intent indicators",
  "Export qualified prospects directly to your CRM",
];

export function LeadDiscoverySection() {
  return (
    <section id="lead-discovery" className="scroll-mt-[90px] bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          {/* LEFT: copy */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[28px] font-extrabold leading-[1.2] tracking-[-0.02em] sm:text-[34px]"
            >
              Discover prospects that match your ideal customer profile
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-[440px] text-[14.5px] leading-[1.75] text-muted"
            >
              Stop wasting time on generic prospect lists. MetaMaster helps you find companies and contacts that
              actually fit your target criteria.
            </motion.p>

            <ul className="mt-7 space-y-3.5">
              {CHECKLIST.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.45, delay: 0.16 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-2.5"
                >
                  <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-[13.5px] leading-[1.6] text-foreground/85">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* RIGHT: product screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div
              aria-hidden
              className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[32px] bg-primary/5 blur-2xl dark:bg-primary/10"
            />
            <div className="overflow-hidden rounded-2xl border-2 border-border/70 shadow-[0_30px_70px_-25px_rgba(15,23,42,.3)]">
              <Image
                src="/products/product-1.png"
                alt="Lead Discovery — search prospects by industry, size, location and intent"
                width={700}
                height={560}
                className="h-auto w-full"
                priority={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

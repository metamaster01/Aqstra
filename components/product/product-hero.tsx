"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLenis } from "lenis/react";

const NAV_ITEMS = [
  { id: "lead-discovery", label: "Lead Discovery" },
  { id: "classification", label: "Classification" },
  { id: "filtering", label: "Filtering" },
  { id: "lead-scoring", label: "Lead Scoring" },
  { id: "campaign-tools", label: "Campaign Tools" },
  { id: "integrations", label: "Integrations" },
];

// Height of the sticky navbar (see components/navbar.tsx), used so a scrolled-to
// section doesn't land underneath it.
const NAVBAR_OFFSET = 58;

export function ProductHero() {
  const [active, setActive] = useState(NAV_ITEMS[0].id);
  const lenis = useLenis();
  const activeRef = useRef(active);
  activeRef.current = active;

  // Scroll-spy: only observes section ids that actually exist in the DOM,
  // so nav items for sections not built yet are simply inert until they are.
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${NAVBAR_OFFSET + 40}px 0px -60% 0px`, threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    setActive(id);
    const target = document.getElementById(id);
    if (!target) return; // section not built yet
    if (lenis) {
      lenis.scrollTo(target, { offset: -NAVBAR_OFFSET, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-background pb-14 pt-16 sm:pb-20 sm:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" />
      </div>

      <div className="mx-auto max-w-[760px] px-6 text-center sm:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[44px] lg:text-[50px]"
        >
          Everything you need to build better pipelines
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-[520px] text-[15px] leading-[1.75] text-muted"
        >
          MetaMaster gives your team precision lead intelligence—from discovery to qualification to structured outreach campaigns.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="#start"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            Start Free Trial <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary dark:bg-transparent"
          >
            Watch Demo <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>

      {/* sub-nav: click scrolls to the matching section below */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mt-11 overflow-x-auto px-6 sm:px-10"
      >
        <div className="mx-auto flex w-max min-w-full items-center justify-start gap-2 sm:justify-center">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                aria-current={isActive}
                className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border bg-card text-foreground/75 hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

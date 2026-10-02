"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface ProductFeatureSectionProps {
  id: string;
  title: string;
  description: string;
  checklist: string[];
  image: { src: string; alt: string };
  /** Which side the screenshot sits on at desktop width (lg+). On mobile,
   *  text always comes first (source order) regardless of this — a single
   *  consistent reading order beats mirroring the desktop layout on a
   *  narrow screen. */
  imagePosition: "left" | "right";
  /** Alternating-row background tint, matching the gray band under
   *  "Filter out noise..." in the reference screenshots. */
  tone?: "default" | "muted";
}

export function ProductFeatureSection({
  id,
  title,
  description,
  checklist,
  image,
  imagePosition,
  tone = "default",
}: ProductFeatureSectionProps) {
  const imageFirst = imagePosition === "left";

  return (
    <section
      id={id}
      className={`scroll-mt-[90px] py-16 sm:py-24 ${tone === "muted" ? "bg-foreground/[0.025]" : "bg-background"}`}
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          {/* TEXT — always first in source order (mobile reads text, then image) */}
          <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[28px] font-extrabold leading-[1.2] tracking-[-0.02em] sm:text-[34px]"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-[440px] text-[14.5px] leading-[1.75] text-muted"
            >
              {description}
            </motion.p>

            <ul className="mt-7 space-y-3.5">
              {checklist.map((item, i) => (
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

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className={`relative mx-auto w-full max-w-[520px] ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
          >
            <div
              aria-hidden
              className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[32px] bg-primary/5 blur-2xl dark:bg-primary/10"
            />
            <div className="overflow-hidden rounded-2xl border-2 border-border/70 shadow-[0_30px_70px_-25px_rgba(15,23,42,.3)]">
              <Image src={image.src} alt={image.alt} width={700} height={560} className="h-auto w-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

/**
 * Shared layout for "Coming soon" and "404" pages:
 * centered Lottie + title + text + buttons. Uses your theme tokens
 * (bg-background, text-foreground, text-muted, border-border, bg-card,
 * text-primary) plus `dark:` variants, so it follows your light/dark logic.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { LottieAnimation } from "./lottie-animation";

const EASE = [0.22, 1, 0.36, 1] as const;

type StatusPageProps = {
  lottieSrc: string;
  lottieLabel: string;
  /** small pill above the title, e.g. "Coming soon" or "Error 404" */
  badge: string;
  /** shows a pulsing dot in the badge */
  pulse?: boolean;
  title: string;
  text: string;
  /** optional small links under the buttons */
  links?: { label: string; href: string }[];
};

export function StatusPage({ lottieSrc, lottieLabel, badge, pulse, title, text, links }: StatusPageProps) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const rise = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay: 0.08 * i, ease: EASE },
  });

  // go back if there is history, otherwise fall back to home (direct visits / new tabs)
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <main className="relative isolate flex min-h-[calc(100svh-58px)] items-center justify-center overflow-hidden bg-background px-6 py-14 sm:px-10">
      {/* soft glow behind the animation */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[34%] h-[420px] w-[min(640px,110%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px] dark:bg-[#3a3690]/35" />
      </div>

      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
        <motion.div {...rise(0)} className="w-full">
          <LottieAnimation
            src={lottieSrc}
            label={lottieLabel}
            className="mx-auto h-[240px] w-full max-w-[420px] sm:h-[320px] sm:max-w-[500px]"
          />
        </motion.div>

        <motion.span
          {...rise(1)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary dark:border-white/20 dark:bg-white/[0.04] dark:text-[#8fb0ff]"
        >
          {pulse && (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          )}
          {badge}
        </motion.span>

        {/* inline sizes: a global h1 rule in the site CSS can override utility classes */}
        <motion.h1
          {...rise(2)}
          className="mt-5 font-display font-extrabold text-foreground"
          style={{ fontSize: "clamp(30px, 5vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.03em", margin: "20px 0 0" }}
        >
          {title}
        </motion.h1>

        <motion.p {...rise(3)} className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-muted sm:text-[17px]">
          {text}
        </motion.p>

        <motion.div {...rise(4)} className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            <Home className="size-4" aria-hidden /> Back to Home
          </Link>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary dark:border-foreground/70 dark:bg-transparent"
          >
            <ArrowLeft className="size-4" aria-hidden /> Go Back
          </button>
        </motion.div>

        {links && links.length > 0 && (
          <motion.nav {...rise(5)} aria-label="Helpful links" className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline dark:text-[#8fb0ff]"
              >
                {l.label}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </main>
  );
}

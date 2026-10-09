import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Solution } from "@/lib/solutions";
import { CONTAINER, h1Style } from "./solution-ui";
import { FadeIn } from "./fade-in";
import { SolutionImage } from "./solution-image";

export function SolutionHero({ solution }: { solution: Solution }) {
  const { name, eyebrow, hero } = solution;

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] to-background dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-32 left-1/3 h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-[#3a3690]/35 blur-[130px]" />
        </div>
      </div>

      <div
        className={`${CONTAINER} grid items-center gap-10 pb-14 pt-10 sm:pb-20 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-20`}
      >
        <FadeIn>
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[12.5px] text-muted">
            <Link href="/solutions" className="transition-colors hover:text-foreground">
              Solutions
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <span aria-current="page" className="text-foreground/80">
              {name}
            </span>
          </nav>

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-[#8aa4ff]">
            {eyebrow}
          </p>
          <h1 className="font-display font-extrabold text-foreground" style={h1Style}>
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.75] text-muted sm:text-[17px]">{hero.subhead}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#demo"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Book a Demo <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              Explore the product
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SolutionImage image={hero.image} priority sizes="(min-width: 1024px) 520px, 100vw" />
        </FadeIn>
      </div>
    </section>
  );
}

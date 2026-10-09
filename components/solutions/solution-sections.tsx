import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import type { Solution } from "@/lib/solutions";
import { getRelatedSolutions } from "@/lib/solutions";
import { CONTAINER, SectionHeading, SolutionIcon } from "./solution-ui";
import { FadeIn } from "./fade-in";
import { SolutionImage } from "./solution-image";

const CARD =
  "rounded-2xl border border-border bg-card p-5 transition-all duration-300 sm:p-6 " +
  "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_18px_40px_-26px_rgba(37,99,235,0.45)] " +
  "dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-primary";

/* ------------------------------ Stats strip ------------------------------ */

export function SolutionStats({ solution }: { solution: Solution }) {
  return (
    <section aria-label="At a glance" className="border-b border-border bg-background">
      <div className={`${CONTAINER} grid grid-cols-3 divide-x divide-border py-7 sm:py-10`}>
        {solution.stats.map((s) => (
          <div key={s.label} className="px-2 text-center sm:px-6">
            <p className="font-display text-[20px] font-bold leading-none text-primary sm:text-[32px] dark:text-[#8aa4ff]">
              {s.value}
            </p>
            <p className="mx-auto mt-2 max-w-[160px] text-[11px] leading-snug text-muted sm:text-[13px]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Challenges ------------------------------ */

export function SolutionChallenges({ solution }: { solution: Solution }) {
  return (
    <section aria-labelledby="challenges-title" className="bg-background py-14 sm:py-20">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="challenges-title">
            <SectionHeading eyebrow="The challenge" title={`What slows ${solution.name} down`} />
          </div>
        </FadeIn>

        <ul className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-3 md:gap-5">
          {solution.challenges.map((c, i) => (
            <li key={c.title}>
              <FadeIn delay={i * 0.07} className="h-full">
                <div className={`${CARD} h-full`}>
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary dark:text-[#8aa4ff]">
                    <SolutionIcon name={c.icon} />
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted">{c.text}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------- Steps --------------------------------- */

export function SolutionSteps({ solution }: { solution: Solution }) {
  return (
    <section aria-labelledby="steps-title" className="bg-foreground/[0.03] py-14 sm:py-20">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="steps-title">
            <SectionHeading
              eyebrow="How AQSTRA helps"
              title="From raw leads to a confident next step"
              description="The same five-stage workflow, tuned for how your team works."
            />
          </div>
        </FadeIn>

        <ol className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {solution.steps.map((s, i) => (
            <li key={s.title}>
              <FadeIn delay={i * 0.07} className="h-full">
                <div className="h-full rounded-2xl border border-border border-t-2 border-t-primary bg-card p-5 sm:p-6 dark:border-white/15 dark:border-t-primary dark:bg-white/[0.03]">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[26px] font-extrabold leading-none text-primary/30 dark:text-[#8aa4ff]/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary dark:text-[#9db8ff]">
                      {s.stage}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[15.5px] font-bold leading-snug text-foreground">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.7] text-muted">{s.text}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------- Showcase ------------------------------- */

export function SolutionShowcase({ solution }: { solution: Solution }) {
  const { showcase } = solution;
  return (
    <section aria-labelledby="showcase-title" className="bg-background py-14 sm:py-24">
      <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-2 lg:gap-20`}>
        <FadeIn>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-[#8aa4ff]">
            {showcase.eyebrow}
          </p>
          <h2
            id="showcase-title"
            className="font-display font-extrabold text-foreground"
            style={{ fontSize: "clamp(26px, 3.2vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.025em", margin: 0 }}
          >
            {showcase.title}
          </h2>
          <p className="mt-4 max-w-[460px] text-[15px] leading-[1.75] text-muted sm:text-base">{showcase.text}</p>

          <ul className="mt-6 space-y-3.5">
            {showcase.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm leading-[1.5]">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <Link
            href={showcase.cta.href}
            className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover dark:text-[#8aa4ff] dark:hover:text-white"
          >
            {showcase.cta.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>

        <FadeIn delay={0.1} className="mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end">
          <SolutionImage image={showcase.image} sizes="(min-width: 1024px) 520px, 100vw" />
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------ Capabilities ----------------------------- */

export function SolutionCapabilities({ solution }: { solution: Solution }) {
  return (
    <section aria-labelledby="capabilities-title" className="bg-foreground/[0.03] py-14 sm:py-20">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="capabilities-title">
            <SectionHeading eyebrow="Capabilities" title="Everything this workflow needs" />
          </div>
        </FadeIn>

        <ul className="mt-9 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {solution.capabilities.map((c, i) => (
            <li key={c.title}>
              <FadeIn delay={(i % 3) * 0.07} className="h-full">
                <Link href={c.href} className={`${CARD} group block h-full`}>
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary dark:text-[#8aa4ff]">
                    <SolutionIcon name={c.icon} />
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted">{c.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-primary dark:text-[#8aa4ff]">
                    Learn more
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */

export function SolutionFaq({ solution }: { solution: Solution }) {
  return (
    <section aria-labelledby="faq-title" className="bg-background py-14 sm:py-20">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="faq-title">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mx-auto mt-9 max-w-[720px] divide-y divide-border rounded-2xl border border-border bg-card sm:mt-12 dark:border-white/15 dark:bg-white/[0.03]">
            {solution.faqs.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-foreground sm:py-5 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    aria-hidden
                    className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="pb-5 text-[14.5px] leading-[1.75] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* --------------------------- Related solutions --------------------------- */

export function RelatedSolutions({ slug }: { slug: string }) {
  const others = getRelatedSolutions(slug);
  return (
    <section aria-labelledby="related-title" className="border-t border-border bg-background py-14 sm:py-20">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="related-title">
            <SectionHeading title="Explore other solutions" />
          </div>
        </FadeIn>

        <ul className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-3 lg:gap-5">
          {others.map((s, i) => (
            <li key={s.slug}>
              <FadeIn delay={i * 0.07} className="h-full">
                <Link href={`/solutions/${s.slug}`} className={`${CARD} group block h-full`}>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-primary dark:text-[#8aa4ff]">
                    {s.eyebrow}
                  </p>
                  <h3 className="mt-2 text-[17px] font-bold text-foreground">{s.name}</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted">{s.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-primary dark:text-[#8aa4ff]">
                    Read more
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

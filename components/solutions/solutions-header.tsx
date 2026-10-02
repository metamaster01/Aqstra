import { Reveal } from "./reveal";

export function SolutionsHeader() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Backgrounds: soft tint in light, faint glow in dark (same family as the hero) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] to-background dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#3a3690]/35 blur-[130px]" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1100px] px-6 pb-14 pt-16 text-center sm:px-10 sm:pb-20 sm:pt-24">
        <Reveal>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-white">
            Solutions
          </p>

          <h1 className="mx-auto max-w-[760px] text-balance font-display text-[36px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[48px] lg:text-[56px]">
            Built for every type of team
          </h1>

          <p className="mx-auto mt-5 max-w-[520px] text-balance text-[15px] leading-[1.75] text-muted sm:text-[17px]">
            Whether you&apos;re in sales, business development, or growth, MetaMaster adapts to
            your workflow and helps you find better prospects.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

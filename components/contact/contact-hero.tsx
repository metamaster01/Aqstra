import { CONTAINER, h1Style } from "@/components/solutions/solution-ui";
import { FadeIn } from "@/components/solutions/fade-in";
import { CONTACT } from "@/lib/contact";

export function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden pb-12 sm:pb-14 lg:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] to-background dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-32 left-1/2 h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-[#3a3690]/35 blur-[130px]" />
        </div>
      </div>

      <div className={`${CONTAINER} pb-10 pt-14 text-center sm:pb-14 sm:pt-20`}>
        <FadeIn>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-white">
            Contact us
          </p>
          <h1 className="mx-auto max-w-[1100px] text-balance font-display font-extrabold text-foreground" style={h1Style}>
            Let&apos;s talk about your pipeline
          </h1>
          <p className="mx-auto mt-5 max-w-[540px] text-balance text-[15px] leading-[1.75] text-muted sm:text-[17px]">
            Questions about AQSTRA, pricing or a demo? Send us a message and a real person will get back to you{" "}
            {CONTACT.responseTime}.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

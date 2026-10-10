import { CONTAINER, SectionHeading } from "@/components/solutions/solution-ui";
import { FadeIn } from "@/components/solutions/fade-in";
import { NEXT_STEPS } from "@/lib/contact";

export function ContactSteps() {
  return (
    <section aria-labelledby="next-title" className="bg-foreground/[0.03] py-14 sm:py-20">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="next-title">
            <SectionHeading eyebrow="What happens next" title="From message to conversation" />
          </div>
        </FadeIn>

        <ol className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-3 md:gap-5">
          {NEXT_STEPS.map((s, i) => (
            <li key={s.title}>
              <FadeIn delay={i * 0.07} className="h-full">
                <div className="h-full rounded-2xl border border-border border-t-2 border-t-primary bg-card p-5 sm:p-6 dark:border-white/15 dark:border-t-primary dark:bg-white/[0.03]">
                  <span className="font-display text-[26px] font-extrabold leading-none text-primary/30 dark:text-[#8aa4ff]/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-muted">{s.text}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { Quote } from "lucide-react";
import { CONTAINER, SectionHeading } from "@/components/solutions/solution-ui";
import { FadeIn } from "@/components/solutions/fade-in";
import { TESTIMONIALS } from "@/lib/demo/marketing";

const TONES = ["bg-[#2563eb]", "bg-[#7c3aed]", "bg-[#0d9488]", "bg-[#db2777]"];

/** Wraps the highlighted phrase of a quote in <mark>-style emphasis. */
function Quoted({ text, highlight }: { text: string; highlight?: string }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="rounded bg-primary/10 px-1 font-semibold text-foreground dark:bg-primary/20">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="bg-foreground/[0.03] py-16 sm:py-24">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="testimonials-title">
            <SectionHeading eyebrow="What teams say" title="Built for teams who live in the pipeline" />
          </div>
        </FadeIn>

        {/* A swipeable row on phones, three columns on desktop. */}
        <ul className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:none] sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.name} className="w-[86%] shrink-0 snap-center sm:w-auto">
              <FadeIn delay={i * 0.08} className="h-full">
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/15 dark:bg-white/[0.03] dark:shadow-none sm:p-7">
                  <Quote aria-hidden className="size-7 text-primary/30 dark:text-[#8aa4ff]/40" />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-[1.75] text-foreground/85">
                    <Quoted text={t.quote} highlight={t.highlight} />
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span
                      aria-hidden
                      className={`grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white ${TONES[i % TONES.length]}`}
                    >
                      {t.name.split(" ").map((w) => w[0]).join("")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold">{t.name}</span>
                      <span className="block truncate text-[12.5px] text-muted">
                        {t.role}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

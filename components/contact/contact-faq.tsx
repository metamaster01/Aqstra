import { ChevronDown } from "lucide-react";
import { CONTAINER, SectionHeading } from "@/components/solutions/solution-ui";
import { FadeIn } from "@/components/solutions/fade-in";
import { CONTACT_FAQS } from "@/lib/contact";

export function ContactFaq() {
  return (
    <section aria-labelledby="contact-faq-title" className="bg-background py-14 sm:py-20">
      <div className={CONTAINER}>
        <FadeIn>
          <div id="contact-faq-title">
            <SectionHeading eyebrow="FAQ" title="Before you write" />
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mx-auto mt-9 max-w-[720px] divide-y divide-border rounded-2xl border border-border bg-card sm:mt-12 dark:border-white/15 dark:bg-white/[0.03]">
            {CONTACT_FAQS.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-foreground sm:py-5 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown aria-hidden className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
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

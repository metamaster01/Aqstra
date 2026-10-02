import { Activity, Briefcase, Globe, Landmark, type LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

const INDUSTRIES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Briefcase,
    title: "SaaS & Technology",
    description: "Find software companies and tech decision makers.",
  },
  {
    icon: Landmark,
    title: "Financial Services",
    description: "Target banks, fintech, and financial institutions.",
  },
  {
    icon: Activity,
    title: "Healthcare",
    description: "Reach providers, payers, and health tech companies.",
  },
  {
    icon: Globe,
    title: "Professional Services",
    description: "Connect with agencies, consultancies, and firms.",
  },
];

/**
 * Navy band in BOTH themes (it's a deliberate contrast section).
 * In dark mode it goes a shade deeper and gets a hairline top border so it
 * still separates from the dark page background.
 */
export function SolutionsIndustries() {
  return (
    <section
      aria-labelledby="industries-heading"
      className="bg-[#0a1628] py-16 text-white sm:py-20 lg:py-24 dark:border-t dark:border-white/10 dark:bg-[#060e1c]"
    >
      <div className="mx-auto w-full max-w-[1000px] px-6 sm:px-10">
        <Reveal className="text-center">
          <h2
            id="industries-heading"
            className="font-display text-[28px] font-bold tracking-[-0.025em] sm:text-[34px]"
          >
            Built for your industry
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-balance text-sm leading-[1.7] text-white/70 sm:text-[15px]">
            MetaMaster works across sectors—find prospects in your target verticals.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map(({ icon: Icon, title, description }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="h-full rounded-xl border border-white/10 bg-[#0f2040] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 dark:bg-[#0b1930]">
                  <span className="grid size-9 place-items-center rounded-lg bg-[#dbe7ff] text-[#1e40af]">
                    <Icon aria-hidden className="size-[17px]" />
                  </span>
                  <h3 className="mt-4 font-display text-[14.5px] font-bold tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-[1.6] text-[#7ea6ff]">{description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

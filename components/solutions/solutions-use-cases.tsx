import { FolderOpen, Globe, Search, Send, Upload, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

const USE_CASES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Outbound Prospecting",
    description: "Find and qualify prospects for cold outreach campaigns with higher reply rates.",
  },
  {
    icon: FolderOpen,
    title: "Account-Based Sales",
    description: "Build targeted lists for your top strategic accounts and key decision makers.",
  },
  {
    icon: Users,
    title: "Partner Development",
    description: "Identify companies that fit your partnership criteria and find the right contacts.",
  },
  {
    icon: Send,
    title: "Event Follow-Up",
    description: "Quickly research and prioritize leads from conferences and trade shows.",
  },
  {
    icon: Upload,
    title: "Market Expansion",
    description: "Discover new markets and verticals with data-driven prospect research.",
  },
  {
    icon: Globe,
    title: "Lead Enrichment",
    description: "Append missing data to existing leads and improve CRM data quality.",
  },
];

export function SolutionsUseCases() {
  return (
    <section
      aria-labelledby="use-cases-heading"
      className="bg-[#f6f8fb] py-16 sm:py-20 lg:py-24 dark:bg-background"
    >
      <div className="mx-auto w-full max-w-[1040px] px-6 sm:px-10">
        <Reveal className="text-center">
          <h2
            id="use-cases-heading"
            className="font-display text-[28px] font-bold tracking-[-0.025em] sm:text-[34px]"
          >
            Common use cases
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-balance text-sm leading-[1.7] text-muted sm:text-[15px]">
            See how teams use MetaMaster to solve real prospecting challenges.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {USE_CASES.map(({ icon: Icon, title, description }, i) => (
            <li key={title}>
              <Reveal delay={Math.min(i, 2) * 0.06} className="h-full">
                <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] dark:shadow-none dark:hover:border-white/25">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-[#cfd3ea]">
                    <Icon aria-hidden className="size-[18px]" />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

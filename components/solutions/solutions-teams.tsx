import Link from "next/link";
import { ArrowRight, BarChart3, Check, CheckCircle2, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

type MockupProps = {
  icon: LucideIcon;
  iconSide: "left" | "right";
  title: string;
  stats: { value: string; label: string }[];
  rows: { name: string; badge: string; badgeSide: "left" | "right" }[];
};

type Team = {
  id: string;
  title: string;
  description: string;
  points: string[];
  cta: { label: string; href: string };
  mockup: MockupProps;
  /** Put the mockup on the left on desktop */
  reverse?: boolean;
};

const TEAMS: Team[] = [
  {
    id: "sales",
    title: "For Sales Teams",
    description:
      "Build focused pipelines with qualified prospects that match your ideal customer profile. Spend less time researching and more time closing.",
    points: [
      "Search by industry, company size, and technology stack",
      "Auto-qualify leads based on your scoring criteria",
      "Sync directly to Salesforce or HubSpot",
      "Track prospect engagement and buying signals",
    ],
    cta: { label: "Learn about Sales Solutions", href: "/solutions/sales" },
    mockup: {
      icon: CheckCircle2,
      iconSide: "right",
      title: "Sales Pipeline",
      stats: [
        { value: "96", label: "Avg Score" },
        { value: "847", label: "Qualified" },
        { value: "23", label: "Meetings" },
      ],
      rows: [
        { name: "Acme Inc.", badge: "96% Match", badgeSide: "right" },
        { name: "Nova Systems", badge: "94% Match", badgeSide: "right" },
      ],
    },
  },
  {
    id: "business-development",
    title: "For Business Development",
    description:
      "Identify partnership opportunities and strategic accounts with precision. Find the right contacts at the right companies for your BD initiatives.",
    points: [
      "Map organizational structures and decision makers",
      "Identify partnership-fit companies by criteria",
      "Track strategic account engagement",
      "Export targeted lists for outreach campaigns",
    ],
    cta: { label: "Learn about BD Solutions", href: "/solutions/business-development" },
    reverse: true,
    mockup: {
      icon: Users,
      iconSide: "left",
      title: "Account Mapping",
      stats: [
        { value: "18", label: "Active" },
        { value: "42", label: "Contacts" },
        { value: "156", label: "Accounts" },
      ],
      rows: [
        { name: "Enterprise Co.", badge: "Strategic", badgeSide: "left" },
        { name: "Growth Inc.", badge: "Partner", badgeSide: "left" },
      ],
    },
  },
  {
    id: "growth",
    title: "For Growth Teams",
    description:
      "Scale your outbound efforts with data-driven prospecting. Build repeatable workflows that turn raw data into qualified opportunities.",
    points: [
      "Create and save prospecting workflows",
      "Segment by firmographics and intent signals",
      "Automate list enrichment and verification",
      "Measure pipeline quality and conversion rates",
    ],
    cta: { label: "Learn about Growth Solutions", href: "/solutions/growth" },
    mockup: {
      icon: BarChart3,
      iconSide: "right",
      title: "Growth Dashboard",
      stats: [
        { value: "2.4K", label: "Prospects" },
        { value: "34%", label: "Reply Rate" },
        { value: "67", label: "Meetings" },
      ],
      rows: [
        { name: "Campaign A", badge: "Active", badgeSide: "right" },
        { name: "Campaign B", badge: "Active", badgeSide: "right" },
      ],
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Mockup card                                                               */
/* -------------------------------------------------------------------------- */

function MockupCard({ icon: Icon, iconSide, title, stats, rows }: MockupProps) {
  const iconEl = <Icon aria-hidden className="size-[18px] text-muted" />;

  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[0_24px_60px_-28px_rgba(37,99,235,0.35),0_2px_6px_rgba(15,23,42,0.05)] sm:p-6 dark:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]"
    >
      {/* faint decorative arcs */}
      <span className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full border border-primary/10" />
      <span className="pointer-events-none absolute -bottom-14 -left-10 size-40 rounded-full border border-primary/10" />

      <div className="relative rounded-xl bg-[#f6f8fb] p-4 sm:p-5 dark:bg-white/[0.04]">
        {/* header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          {iconSide === "left" && iconEl}
          <span className="text-[13px] font-semibold">{title}</span>
          {iconSide === "right" && iconEl}
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-2 py-5 text-center sm:py-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-[22px] font-bold leading-none text-primary sm:text-[26px] dark:text-[#8aa4ff]">
                {s.value}
              </p>
              <p className="mt-1.5 text-[11px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* rows */}
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card px-3.5 py-2.5"
            >
              {r.badgeSide === "left" && <Badge>{r.badge}</Badge>}
              <span className="truncate text-[13px] font-semibold">{r.name}</span>
              {r.badgeSide === "right" && <Badge>{r.badge}</Badge>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="shrink-0 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export function SolutionsTeams() {
  return (
    <section aria-label="Solutions by team" className="bg-background">
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-10">
        <div className="divide-y divide-border border-t border-border">
          {TEAMS.map((team) => (
            <article
              key={team.id}
              id={team.id}
              className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-20"
            >
              {/* Text */}
              <Reveal className={team.reverse ? "lg:order-2" : ""}>
                <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-[-0.025em] sm:text-[34px]">
                  {team.title}
                </h2>
                <p className="mt-4 max-w-[440px] text-[15px] leading-[1.75] text-muted sm:text-base">
                  {team.description}
                </p>

                <ul className="mt-6 space-y-3.5">
                  {team.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm leading-[1.5]">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={team.cta.href}
                  className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover dark:text-[#8aa4ff] dark:hover:text-white"
                >
                  {team.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>

              {/* Visual */}
              <Reveal
                delay={0.1}
                className={`mx-auto w-full max-w-[480px] ${
                  team.reverse
                    ? "lg:order-1 lg:mx-0 lg:justify-self-start"
                    : "lg:mx-0 lg:justify-self-end"
                }`}
              >
                <MockupCard {...team.mockup} />
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

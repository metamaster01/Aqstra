import {
  BarChart3, Building2, Clock, Database, Filter, Gauge, Layers, ListChecks, Mail,
  Network, RefreshCw, Search, Send, ShieldCheck, Sparkles, Target, Users, Workflow, Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/solutions";

export const CONTAINER = "mx-auto w-full max-w-[1100px] px-6 sm:px-10";

// Inline sizes: a global h1/h2 rule in the site CSS can override utility classes.
export const h1Style = {
  fontSize: "clamp(32px, 5vw, 52px)",
  lineHeight: 1.08,
  letterSpacing: "-0.03em",
  margin: 0,
} as const;
export const h2Style = {
  fontSize: "clamp(26px, 3.4vw, 38px)",
  lineHeight: 1.12,
  letterSpacing: "-0.03em",
  margin: 0,
} as const;

const ICONS: Record<IconKey, LucideIcon> = {
  search: Search, filter: Filter, target: Target, gauge: Gauge, mail: Mail, users: Users,
  database: Database, shield: ShieldCheck, refresh: RefreshCw, chart: BarChart3, layers: Layers,
  zap: Zap, clock: Clock, network: Network, list: ListChecks, workflow: Workflow,
  building: Building2, send: Send, sparkles: Sparkles,
};

export function SolutionIcon({ name, className = "size-5" }: { name: IconKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden className={className} strokeWidth={1.9} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[620px] text-center" : "max-w-[560px]"}>
      {eyebrow && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-[#8aa4ff]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display font-extrabold text-foreground" style={h2Style}>
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[14.5px] leading-[1.75] text-muted sm:mt-4 sm:text-base">{description}</p>
      )}
    </div>
  );
}

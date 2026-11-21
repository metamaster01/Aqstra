import { Activity, Coins, Cpu, Factory, Handshake, Landmark, Newspaper, Ship, TrendingUp, Truck, Users, type LucideIcon } from "lucide-react";

export interface SignalMeta {
  label: string;
  icon: LucideIcon;
  chip: string; // pill colours
  bar: string; // solid colour for charts
  glow: string; // gradient start for featured cards
}

// Full class names on purpose: Tailwind only generates classes it can read in the source.
const SIGNALS: Record<string, SignalMeta> = {
  "trade-tariffs": { label: "Trade & tariffs", icon: Ship, chip: "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-300", bar: "bg-sky-500", glow: "from-sky-500/20" },
  "regulation-policy": { label: "Regulation & policy", icon: Landmark, chip: "bg-violet-500/10 text-violet-700 ring-violet-500/25 dark:text-violet-300", bar: "bg-violet-500", glow: "from-violet-500/20" },
  "funding-investment": { label: "Funding & investment", icon: Coins, chip: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300", bar: "bg-emerald-500", glow: "from-emerald-500/20" },
  "expansion-capacity": { label: "Expansion & capacity", icon: Factory, chip: "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300", bar: "bg-amber-500", glow: "from-amber-500/20" },
  "mna-partnerships": { label: "M&A & partnerships", icon: Handshake, chip: "bg-fuchsia-500/10 text-fuchsia-700 ring-fuchsia-500/25 dark:text-fuchsia-300", bar: "bg-fuchsia-500", glow: "from-fuchsia-500/20" },
  "supply-chain-logistics": { label: "Supply chain", icon: Truck, chip: "bg-orange-500/10 text-orange-700 ring-orange-500/25 dark:text-orange-300", bar: "bg-orange-500", glow: "from-orange-500/20" },
  "demand-market-growth": { label: "Demand & growth", icon: TrendingUp, chip: "bg-teal-500/10 text-teal-700 ring-teal-500/25 dark:text-teal-300", bar: "bg-teal-500", glow: "from-teal-500/20" },
  "hiring-workforce": { label: "Hiring & workforce", icon: Users, chip: "bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300", bar: "bg-rose-500", glow: "from-rose-500/20" },
  "technology-adoption": { label: "Technology", icon: Cpu, chip: "bg-indigo-500/10 text-indigo-700 ring-indigo-500/25 dark:text-indigo-300", bar: "bg-indigo-500", glow: "from-indigo-500/20" },
  "macro-markets": { label: "Macro & markets", icon: Activity, chip: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/25 dark:text-cyan-300", bar: "bg-cyan-500", glow: "from-cyan-500/20" },
};

const FALLBACK: SignalMeta = { label: "Signal", icon: Newspaper, chip: "bg-foreground/5 text-muted ring-foreground/15", bar: "bg-foreground/40", glow: "from-primary/15" };

export const signalMeta = (slug: string): SignalMeta => SIGNALS[slug] ?? FALLBACK;

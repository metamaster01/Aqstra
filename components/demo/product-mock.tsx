import { Building2, DollarSign, Search, Users } from "lucide-react";

/* A decorative preview of the product. Purely visual, so it's hidden from screen readers. */

const ROWS = [
  { name: "Halcyon Software", meta: "SaaS · 250–500 employees", match: 96 },
  { name: "Bluecrest Systems", meta: "Cloud · 500–1K employees", match: 93 },
  { name: "Corelane AI", meta: "AI · 100–250 employees", match: 91 },
];

const NAV = [
  { label: "Discover", icon: Search, active: true },
  { label: "Companies", icon: Building2 },
  { label: "People", icon: Users },
  { label: "Opportunities", icon: DollarSign },
];

function Results() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-[11.5px] text-muted">
        <Search className="size-3.5 shrink-0" />
        <span className="truncate">Find SaaS companies hiring sales leaders in the US…</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["Industry: SaaS", "Location: United States", "Intent: High"].map((c) => (
          <span key={c} className="rounded-md bg-primary/10 px-2 py-1 text-[10.5px] font-semibold text-primary dark:text-[#9db8ff]">
            {c}
          </span>
        ))}
      </div>
      {ROWS.map((r) => (
        <div key={r.name} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold">{r.name}</p>
            <p className="truncate text-[10.5px] text-muted">{r.meta}</p>
          </div>
          <span className="shrink-0 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400">
            {r.match}% Match
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProductMock({ variant = "compact", className = "" }: { variant?: "compact" | "full"; className?: string }) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-30px_rgba(37,99,235,0.4),0_2px_6px_rgba(15,23,42,0.05)] dark:border-white/15 dark:bg-white/[0.04] dark:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff6159]" />
        <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="size-2.5 rounded-full bg-[#28c940]" />
        {variant === "compact" && <span className="ml-3 text-[11.5px] font-semibold">AQSTRA — Prospect Discovery</span>}
      </div>

      {variant === "compact" ? (
        <div className="p-4">
          <Results />
        </div>
      ) : (
        <div className="grid sm:grid-cols-[150px_1fr]">
          <nav className="hidden border-r border-border p-3 sm:block">
            <ul className="space-y-1">
              {NAV.map(({ label, icon: Icon, active }) => (
                <li
                  key={label}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11.5px] font-medium ${
                    active ? "bg-primary/10 text-primary dark:text-[#9db8ff]" : "text-muted"
                  }`}
                >
                  <Icon className="size-3.5" /> {label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4">
            <Results />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Industry, Scope } from "@/lib/news/types";
import { useNews } from "./news-provider";

const SCOPES: { value: Scope | null; label: string }[] = [
  { value: null, label: "All" },
  { value: "india", label: "India" },
  { value: "global", label: "Global" },
];

/** Sticky filter strip: region pills (with a sliding highlight) plus a scrolling row of industries. */
export function FilterBar({ industries }: { industries: Industry[] }) {
  const { scope, industry, setScope, setIndustry, clearFilters } = useNews();
  const active = scope !== null || industry !== null;

  return (
    <div className="sticky top-[58px] z-30 -mx-6 border-y border-border/60 bg-background/80 px-6 py-3 backdrop-blur-xl sm:-mx-10 sm:px-10 lg:-mx-14 lg:px-14">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div role="radiogroup" aria-label="Region" className="relative flex shrink-0 gap-1 rounded-full border border-border bg-card/70 p-1">
          {SCOPES.map((s) => {
            const on = scope === s.value;
            return (
              <button
                key={s.label} type="button" role="radio" aria-checked={on}
                onClick={() => setScope(s.value)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${on ? "text-primary-foreground" : "text-muted hover:text-foreground"}`}
              >
                {on && <motion.span layoutId="scope-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                <span className="relative">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div role="group" aria-label="Industry" className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-28px),transparent)] [&::-webkit-scrollbar]:hidden">
          <Chip on={industry === null} onClick={() => setIndustry(null)}>All industries</Chip>
          {industries.map((i) => (
            <Chip key={i.slug} on={industry === i.slug} onClick={() => setIndustry(industry === i.slug ? null : i.slug)}>{i.name}</Chip>
          ))}
        </div>

        {active && (
          <button type="button" onClick={clearFilters} className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary lg:self-auto">
            <X className="size-3.5" aria-hidden /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button" aria-pressed={on} onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all ${on ? "border-primary bg-primary/10 text-primary dark:text-[#9db6ff]" : "border-border text-muted hover:-translate-y-px hover:border-foreground/40 hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

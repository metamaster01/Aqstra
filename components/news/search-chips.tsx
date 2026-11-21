"use client";

import { ArrowUpRight, Search } from "lucide-react";
import { searchUrl } from "@/lib/news/config";
import type { SuggestedSearch } from "@/lib/news/types";

/** "Search this on Aqstra" shortcuts. These are the whole point of the page. */
export function SearchChips({ searches, size = "sm", className = "" }: { searches: SuggestedSearch[]; size?: "sm" | "lg"; className?: string }) {
  if (!searches.length) return null;
  return (
    <ul className={`relative z-10 flex flex-wrap gap-2 ${className}`} aria-label="Suggested searches on Aqstra">
      {searches.map((s) => (
        <li key={s.query}>
          <a
            href={searchUrl(s.query)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Search Aqstra for: ${s.query}`}
            className={`group/chip inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/[0.07] font-medium text-primary transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-[#9db6ff] dark:hover:text-primary-foreground ${size === "lg" ? "px-3.5 py-2 text-sm" : "px-2.5 py-1.5 text-xs"}`}
          >
            <Search className={size === "lg" ? "size-4" : "size-3.5"} aria-hidden />
            <span>{s.label}</span>
            <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover/chip:-translate-y-px group-hover/chip:translate-x-px group-hover/chip:opacity-100" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { FeaturedCard, GridCard, SideCard } from "./resource-card";
import { RESOURCES, TYPE_FILTERS, TYPE_LABEL, type TypeFilter } from "../../lib/resources";

const CONTAINER = "mx-auto w-full max-w-[1200px] px-6 sm:px-10";

export function ResourcesHome() {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("All");

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const main = RESOURCES.find((r) => r.featured === "main");
  const side = RESOURCES.filter((r) => r.featured === "side");

  // Not searching → "Latest" excludes the featured trio (they're shown above).
  // Searching     → look through everything.
  const list = useMemo(
    () =>
      RESOURCES.filter((r) => {
        if (!searching && r.featured) return false;
        if (type !== "All" && r.type !== type) return false;
        if (!searching) return true;
        return [r.title, r.description, r.tag, r.category, r.type]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }),
    [q, searching, type]
  );

  const clearAll = () => {
    setQuery("");
    setType("All");
  };

  return (
    <>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] to-background dark:hidden" />
          <div className="absolute inset-0 hidden dark:block">
            <div className="absolute -top-32 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#3a3690]/40 blur-[130px]" />
          </div>
        </div>

        <div className={`${CONTAINER} pb-12 pt-16 text-center sm:pb-16 sm:pt-24`}>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-white">
            Aqstra Resources
          </p>

          <h1 className="mx-auto max-w-[760px] text-balance font-display text-[36px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[46px] lg:text-[54px]">
            Insights for better prospecting
          </h1>

          <p className="mx-auto mt-5 max-w-[540px] text-balance text-[15px] leading-[1.75] text-muted sm:text-[17px]">
            Practical guides, proven strategies, and expert insights to help your team build
            better pipelines and create more meaningful outreach.
          </p>

          {/* Search */}
          <div role="search" className="relative mx-auto mt-9 w-full max-w-[580px] sm:mt-11">
            <label htmlFor={searchId} className="sr-only">
              Search guides, articles, and insights
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted"
            />
            <input
              id={searchId}
              type="text"
              inputMode="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, articles, and insights..."
              className="h-[54px] w-full rounded-xl border border-border bg-card pl-11 pr-11 text-sm shadow-[0_2px_10px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-muted/80 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:shadow-none dark:focus:ring-primary/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted transition hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------- Featured ----------------------------- */}
      {!searching && main && (
        <section aria-labelledby="featured-heading" className="bg-background">
          <div className={`${CONTAINER} pb-14 sm:pb-20`}>
            <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
              <h2
                id="featured-heading"
                className="font-display text-[26px] font-bold tracking-[-0.025em] sm:text-[30px]"
              >
                Featured insights
              </h2>
              <Link
                href="/resource/all"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover dark:text-[#cfd3ea] dark:hover:text-white"
              >
                View all articles
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
              <FeaturedCard resource={main} />
              <div className="grid gap-5 lg:grid-rows-2 lg:gap-6">
                {side.map((r) => (
                  <SideCard key={r.slug} resource={r} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------ Latest / Results ------------------------ */}
      <section aria-labelledby="latest-heading" className="bg-background">
        <div className={`${CONTAINER} pb-20 sm:pb-28 ${searching ? "pt-2" : ""}`}>
          <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="latest-heading"
              className="font-display text-[26px] font-bold tracking-[-0.025em] sm:text-[30px]"
              aria-live="polite"
            >
              {searching
                ? `${list.length} ${list.length === 1 ? "result" : "results"} for “${query.trim()}”`
                : "Latest resources"}
            </h2>

            {/* Type filter – scrolls sideways on small screens */}
            <div
              role="group"
              aria-label="Filter by type"
              className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {TYPE_FILTERS.map((f) => {
                const active = type === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setType(f)}
                    aria-pressed={active}
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {TYPE_LABEL[f]}
                  </button>
                );
              })}
            </div>
          </div>

          {list.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {list.map((r) => (
                <GridCard key={r.slug} resource={r} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <p className="font-display text-lg font-bold">Nothing matched your search</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-[1.65] text-muted">
                Try a different keyword, or browse everything.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

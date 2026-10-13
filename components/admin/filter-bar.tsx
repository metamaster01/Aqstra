"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { inputClass } from "./ui";

type Option = { value: string; label: string };
export type Filters = { q: string; status: string; category: string; type: string };

/** Search + filters that live in the URL, so lists are shareable and survive a refresh. */
export function FilterBar({
  initial,
  categories,
  types,
}: {
  initial: Filters;
  categories: Option[];
  types?: Option[]; // only resources have a type filter
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initial.q);
  const first = useRef(true);

  function go(next: Partial<Filters>) {
    const merged = { ...initial, q, ...next };
    const params = new URLSearchParams();
    (Object.keys(merged) as (keyof Filters)[]).forEach((k) => {
      const v = merged[k];
      if (v && v !== "all") params.set(k, v);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname); // any filter change returns to page 1
  }

  // Debounce typing in the search box.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => go({ q }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const active = Boolean(initial.q || initial.status !== "all" || initial.category || initial.type);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[200px] flex-1 sm:max-w-[320px]">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <label htmlFor="admin-search" className="sr-only">
          Search by title or slug
        </label>
        <input
          id="admin-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or slug"
          className={`${inputClass} pl-9`}
        />
      </div>

      <select
        aria-label="Status"
        value={initial.status}
        onChange={(e) => go({ status: e.target.value })}
        className={`${inputClass} w-auto`}
      >
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Drafts</option>
      </select>

      {types && (
        <select
          aria-label="Type"
          value={initial.type}
          onChange={(e) => go({ type: e.target.value })}
          className={`${inputClass} w-auto`}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      )}

      <select
        aria-label="Category"
        value={initial.category}
        onChange={(e) => go({ category: e.target.value })}
        className={`${inputClass} w-auto max-w-[220px]`}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      {active && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.replace(pathname);
          }}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted transition-colors hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden /> Clear
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { inputClass } from "@/components/admin/ui";

type Select = { name: string; label: string; allLabel: string; value: string; options: { value: string; label: string }[] };

/** Search (and optional dropdowns) that live in the URL. The status tab is kept; the page number resets. */
export function InboxFilters({
  q,
  status,
  selects = [],
  placeholder,
}: {
  q: string;
  status: string;
  selects?: Select[];
  placeholder: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [text, setText] = useState(q);
  const first = useRef(true);

  function go(next: { q?: string; select?: { name: string; value: string } }) {
    const params = new URLSearchParams();
    const query = next.q ?? text;
    if (query.trim()) params.set("q", query.trim());
    if (status && status !== "all") params.set("status", status);
    selects.forEach((s) => {
      const v = next.select?.name === s.name ? next.select.value : s.value;
      if (v) params.set(s.name, v);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => go({ q: text }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const active = Boolean(q || selects.some((s) => s.value));

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-[200px] flex-1 sm:max-w-[340px]">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <label htmlFor="inbox-search" className="sr-only">
          {placeholder}
        </label>
        <input
          id="inbox-search"
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pl-9`}
        />
      </div>

      {selects.map((s) => (
        <select
          key={s.name}
          aria-label={s.label}
          value={s.value}
          onChange={(e) => go({ select: { name: s.name, value: e.target.value } })}
          className={`${inputClass} w-auto max-w-[220px]`}
        >
          <option value="">{s.allLabel}</option>
          {s.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ))}

      {active && (
        <button
          type="button"
          onClick={() => {
            setText("");
            router.replace(status && status !== "all" ? `${pathname}?status=${status}` : pathname);
          }}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted transition-colors hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden /> Clear
        </button>
      )}
    </div>
  );
}

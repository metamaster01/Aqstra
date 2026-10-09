"use client";

import { useEffect, useState } from "react";
import type { PageSection } from "../../lib/content";

/** Right-column "On this page" — built straight from each section's title/anchor. */
export function DocsToc({ sections }: { sections: PageSection[] }) {
  const items = sections.filter((s) => s.title && s.anchor);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.anchor ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    items.forEach((s) => {
      const el = document.getElementById(s.anchor!);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">On this page</p>
      <ul className="space-y-2 border-l border-border pl-4 text-[13px]">
        {items.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.anchor}`}
              className={`block transition-colors ${
                activeId === s.anchor ? "font-semibold text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

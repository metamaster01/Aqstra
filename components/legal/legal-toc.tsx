"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string };

/** Sticky "On this page" list for desktop, with the current section highlighted. */
export function LegalToc({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">On this page</p>
      <ul className="max-h-[calc(100vh-9rem)] space-y-0.5 overflow-y-auto border-l border-border pr-2 text-[13px]">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={`-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors ${
                active === i.id
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {i.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

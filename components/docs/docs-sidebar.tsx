"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { DocCategory, DocPage } from "../../lib/content";

function groupPagesByCategory(pages: DocPage[]) {
  const map = new Map<string, DocPage[]>();
  for (const p of pages) {
    if (!p.categoryId) continue;
    if (!map.has(p.categoryId)) map.set(p.categoryId, []);
    map.get(p.categoryId)!.push(p);
  }
  return map;
}

function CategoryGroup({
  category,
  pagesByCategory,
  activeSlug,
  depth = 0,
}: {
  category: DocCategory;
  pagesByCategory: Map<string, DocPage[]>;
  activeSlug: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(true);
  const pages = pagesByCategory.get(category.id) ?? [];
  const hasChildren = (category.children?.length ?? 0) > 0;

  return (
    <div className={depth > 0 ? "ml-3 border-l border-border pl-3" : ""}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1.5 text-[12.5px] font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
      >
        {category.title}
        <ChevronRight className={`size-3.5 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="mt-1 space-y-0.5">
          {pages.map((p) => {
            const active = p.slug === activeSlug;
            return (
              <Link
                key={p.id}
                href={`/docs/${p.slug}`}
                aria-current={active ? "page" : undefined}
                className={`block rounded-md px-2.5 py-1.5 text-[13.5px] transition-colors ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {p.title}
              </Link>
            );
          })}

          {hasChildren &&
            category.children!.map((child) => (
              <CategoryGroup
                key={child.id}
                category={child}
                pagesByCategory={pagesByCategory}
                activeSlug={activeSlug}
                depth={depth + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar({ tree, pages }: { tree: DocCategory[]; pages: DocPage[] }) {
  const pathname = usePathname();
  const activeSlug = pathname.split("/").filter(Boolean).pop() ?? "";
  const pagesByCategory = groupPagesByCategory(pages);

  return (
    <nav aria-label="Documentation" className="space-y-5 text-sm">
      {tree.map((cat) => (
        <CategoryGroup key={cat.id} category={cat} pagesByCategory={pagesByCategory} activeSlug={activeSlug} />
      ))}
    </nav>
  );
}

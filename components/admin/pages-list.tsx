import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText, Plus } from "lucide-react";
import {
  PAGE_SIZE,
  RESOURCE_TYPES,
  getCategoryOptions,
  listAdminPages,
  type Area,
} from "@/lib/admin/queries";
import { FilterBar, type Filters } from "./filter-bar";
import { PageRowActions } from "./page-row-actions";
import { Badge, EmptyState, PageHeader, btn, cardClass, formatDate } from "./ui";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

const COPY = {
  docs: {
    title: "Docs",
    description: "Documentation pages shown in the docs sidebar.",
    base: "/admin/docs",
    publicBase: "/docs",
    newLabel: "New doc page",
    emptyText: "Create your first documentation page.",
  },
  resource: {
    title: "Resources",
    description: "Articles, guides, videos and blog posts shown on the Resources pages.",
    base: "/admin/resources",
    publicBase: "/resource",
    newLabel: "New resource",
    emptyText: "Create your first article, guide, video or blog post.",
  },
} as const;

export async function AdminPagesList({ area, searchParams }: { area: Area; searchParams: SP }) {
  const c = COPY[area];

  const filters: Filters = {
    q: first(searchParams.q),
    status: first(searchParams.status) || "all",
    category: first(searchParams.category),
    type: first(searchParams.type),
  };
  const page = Math.max(1, Number(first(searchParams.page)) || 1);

  const [{ rows, total }, categories] = await Promise.all([
    listAdminPages({ area, ...filters, page }),
    getCategoryOptions(area),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(filters.q || filters.status !== "all" || filters.category || filters.type);

  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.category) params.set("category", filters.category);
    if (filters.type) params.set("type", filters.type);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `${c.base}?${qs}` : c.base;
  };

  return (
    <>
      <PageHeader
        title={c.title}
        description={c.description}
        actions={
          <Link href={`${c.base}/new`} className={btn("primary")}>
            <Plus className="size-4" aria-hidden /> {c.newLabel}
          </Link>
        }
      />

      <FilterBar
        initial={filters}
        categories={categories.map((o) => ({ value: o.id, label: o.label }))}
        types={area === "resource" ? RESOURCE_TYPES.map((t) => ({ value: t, label: t })) : undefined}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={filtered ? "Nothing matches those filters" : `No ${c.title.toLowerCase()} yet`}
          text={filtered ? "Try a different search, or clear the filters." : c.emptyText}
          action={
            filtered ? (
              <Link href={c.base} className={btn("secondary")}>
                Clear filters
              </Link>
            ) : (
              <Link href={`${c.base}/new`} className={btn("primary")}>
                <Plus className="size-4" aria-hidden /> {c.newLabel}
              </Link>
            )
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className={`${cardClass} hidden overflow-hidden md:block`}>
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-border text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  {area === "resource" && <th className="px-4 py-3">Type</th>}
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-foreground/[0.025]">
                    <td className="max-w-[320px] px-4 py-3">
                      <Link href={`${c.base}/${r.id}`} className="block truncate font-semibold hover:text-primary">
                        {r.title}
                      </Link>
                      <span className="block truncate font-mono text-[11.5px] text-muted">/{r.slug}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{r.categoryTitle ?? "—"}</td>
                    {area === "resource" && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge>{r.type}</Badge>
                          {r.featured && <Badge tone="info">Featured · {r.featured}</Badge>}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <Badge tone={r.published ? "success" : "warning"}>{r.published ? "Published" : "Draft"}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(r.updated_at)}</td>
                    <td className="px-2 py-2">
                      <PageRowActions
                        id={r.id}
                        title={r.title}
                        published={r.published}
                        editHref={`${c.base}/${r.id}`}
                        viewHref={`${c.publicBase}/${r.slug}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={r.id} className={`${cardClass} p-4`}>
                <Link href={`${c.base}/${r.id}`} className="block font-semibold leading-snug hover:text-primary">
                  {r.title}
                </Link>
                <p className="mt-0.5 truncate font-mono text-[11.5px] text-muted">/{r.slug}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge tone={r.published ? "success" : "warning"}>{r.published ? "Published" : "Draft"}</Badge>
                  {area === "resource" && <Badge>{r.type}</Badge>}
                  {r.featured && <Badge tone="info">Featured · {r.featured}</Badge>}
                  {r.categoryTitle && <Badge>{r.categoryTitle}</Badge>}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[12.5px] text-muted">{formatDate(r.updated_at)}</span>
                  <PageRowActions
                    id={r.id}
                    title={r.title}
                    published={r.published}
                    editHref={`${c.base}/${r.id}`}
                    viewHref={`${c.publicBase}/${r.slug}`}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
            <p>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            {pages > 1 && (
              <div className="flex items-center gap-2">
                <Link
                  href={pageHref(page - 1)}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                  className={`${btn("secondary", "sm")} ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
                >
                  <ChevronLeft className="size-4" aria-hidden /> Previous
                </Link>
                <span>
                  Page {page} of {pages}
                </span>
                <Link
                  href={pageHref(page + 1)}
                  aria-disabled={page >= pages}
                  tabIndex={page >= pages ? -1 : undefined}
                  className={`${btn("secondary", "sm")} ${page >= pages ? "pointer-events-none opacity-40" : ""}`}
                >
                  Next <ChevronRight className="size-4" aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

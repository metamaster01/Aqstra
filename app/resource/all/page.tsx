import Link from "next/link";
import { getAllResources } from "../../../lib/queries";
import { GridCard } from "../../../components/resource/resource-card";
import { TYPE_FILTERS, TYPE_LABEL } from "../../../lib/content";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";

const PAGE_SIZE = 24;

export default async function AllResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 0) || 0;
  const type = sp.type ?? "All";
  const { items, total } = await getAllResources({ page, pageSize: PAGE_SIZE, type });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
     <Navbar />
    <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 sm:py-12">
      <h1 className="font-display text-[30px] font-extrabold tracking-[-0.025em] text-foreground sm:text-[36px]">
        All resources
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <Link
            key={f}
            href={`/resource/all?type=${f}`}
            aria-current={type === f ? "true" : undefined}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              type === f
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted hover:border-primary hover:text-foreground"
            }`}
          >
            {TYPE_LABEL[f]}
          </Link>
        ))}
      </div>

      {items.length > 0 ? (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((r) => (
            <GridCard key={r.slug} resource={r} />
          ))}
        </div>
      ) : (
        <div className="mt-9 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <p className="font-display text-lg font-bold">Nothing here yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-[1.65] text-muted">
            Try a different type filter.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <Link
            aria-disabled={page <= 0}
            href={`/resource/all?type=${type}&page=${Math.max(0, page - 1)}`}
            className={`rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors ${
              page <= 0 ? "pointer-events-none opacity-40" : "hover:border-primary"
            }`}
          >
            Previous
          </Link>
          <span className="text-sm text-muted">
            Page {page + 1} of {totalPages}
          </span>
          <Link
            aria-disabled={page >= totalPages - 1}
            href={`/resource/all?type=${type}&page=${Math.min(totalPages - 1, page + 1)}`}
            className={`rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors ${
              page >= totalPages - 1 ? "pointer-events-none opacity-40" : "hover:border-primary"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
    <FooterSection />
    </div>
  );
}
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { btn } from "@/components/admin/ui";

export function Pagination({
  basePath,
  params,
  page,
  total,
  pageSize,
}: {
  basePath: string;
  params: Record<string, string>; // the filters to keep on every link
  page: number;
  total: number;
  pageSize: number;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const href = (n: number) => {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && p.set(k, v));
    if (n > 1) p.set("page", String(n));
    const qs = p.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
      <p>
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-2">
          <Link
            href={href(page - 1)}
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
            href={href(page + 1)}
            aria-disabled={page >= pages}
            tabIndex={page >= pages ? -1 : undefined}
            className={`${btn("secondary", "sm")} ${page >= pages ? "pointer-events-none opacity-40" : ""}`}
          >
            Next <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}

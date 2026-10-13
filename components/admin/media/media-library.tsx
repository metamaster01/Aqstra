"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileVideo, Loader2, Search, Trash2 } from "lucide-react";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { Badge, formatDate, iconBtn, inputClass } from "@/components/admin/ui";
import { deleteMedia, listMedia } from "@/lib/admin/media-actions";
import { formatBytes, type MediaAsset, type MediaFolder, type MediaKind } from "@/lib/admin/media-config";

/**
 * Browse uploaded files. With `onSelect` it becomes a picker (click to choose);
 * without it, files can be deleted. `refreshKey` reloads the list after an upload.
 */
export function MediaLibrary({
  kind,
  folder,
  onSelect,
  refreshKey = 0,
}: {
  kind?: MediaKind; // lock to one kind (the picker does)
  folder?: MediaFolder; // starting folder filter
  onSelect?: (asset: MediaAsset) => void;
  refreshKey?: number;
}) {
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState<MediaKind | "">(kind ?? "");
  const [folderFilter, setFolderFilter] = useState<MediaFolder | "">(folder ?? "");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const firstRun = useRef(true);

  // A new search or filter always starts on page 1.
  useEffect(() => {
    setPage(1);
  }, [q, kindFilter, folderFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await listMedia({ q, kind: kindFilter || undefined, folder: folderFilter || undefined, page });
    if (res.ok) {
      setItems(res.items);
      setTotal(res.total);
      setPageSize(res.pageSize);
      setError(null);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, [q, kindFilter, folderFilter, page]);

  useEffect(() => {
    // Debounce typing, but load immediately on the first render and after uploads/deletes.
    const delay = firstRun.current ? 0 : 250;
    firstRun.current = false;
    const t = setTimeout(load, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, refreshKey, reload]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[180px] flex-1 sm:max-w-[280px]">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <label htmlFor="media-search" className="sr-only">
            Search files
          </label>
          <input
            id="media-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by file name"
            className={`${inputClass} pl-9`}
          />
        </div>
        {!kind && (
          <select
            aria-label="File type"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as MediaKind | "")}
            className={`${inputClass} w-auto`}
          >
            <option value="">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        )}
        <select
          aria-label="Folder"
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value as MediaFolder | "")}
          className={`${inputClass} w-auto`}
        >
          <option value="">All folders</option>
          <option value="resources">Resources</option>
          <option value="docs">Docs</option>
        </select>
        {loading && <Loader2 className="size-4 animate-spin text-muted" aria-label="Loading" />}
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : items.length === 0 && !loading ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-[14px] text-muted">
          {q || kindFilter || folderFilter ? "No files match those filters." : "No files uploaded yet."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((a) => (
            <li
              key={a.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card dark:border-white/15 dark:bg-white/[0.03]"
            >
              <button
                type="button"
                disabled={!onSelect}
                onClick={() => onSelect?.(a)}
                aria-label={onSelect ? `Use ${a.name}` : a.name}
                className={`block w-full text-left ${onSelect ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="relative aspect-[4/3] bg-foreground/5">
                  {a.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.url} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <div className="grid size-full place-items-center text-muted">
                      <FileVideo className="size-8" aria-hidden />
                    </div>
                  )}
                  {onSelect && (
                    <span className="absolute inset-0 grid place-items-center bg-primary/0 text-[13px] font-semibold text-white opacity-0 transition group-hover:bg-primary/70 group-hover:opacity-100">
                      Use this
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[12.5px] font-semibold" title={a.name}>
                    {a.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge>{formatBytes(a.sizeBytes)}</Badge>
                    {a.width && a.height ? <Badge>{a.width}×{a.height}</Badge> : null}
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-muted">
                    {a.folder} · {formatDate(a.createdAt)}
                  </p>
                </div>
              </button>

              {!onSelect && (
                <div className="absolute right-1.5 top-1.5 rounded-lg bg-background/90 shadow-sm backdrop-blur">
                  <ConfirmAction
                    action={deleteMedia}
                    fields={{ id: a.id }}
                    title="Delete this file?"
                    message={`"${a.name}" will be removed from storage. If a page still uses it, you'll be told which one.`}
                    confirmLabel="Delete file"
                    trigger={<Trash2 className="size-4" />}
                    triggerLabel={`Delete ${a.name}`}
                    triggerClassName={`${iconBtn} hover:text-red-600`}
                    onDone={() => setReload((n) => n + 1)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 text-[13px] text-muted">
          <span>
            Page {page} of {pages} · {total} files
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-semibold transition-colors hover:border-primary disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden /> Previous
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-semibold transition-colors hover:border-primary disabled:pointer-events-none disabled:opacity-40"
            >
              Next <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

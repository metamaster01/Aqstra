"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileVideo, Loader2, RotateCcw, TriangleAlert, UploadCloud, X } from "lucide-react";
import { ACCEPT, MEDIA_RULES, formatBytes, type MediaAsset, type MediaFolder } from "@/lib/admin/media-config";
import { useMediaUpload, type UploadItem } from "./use-media-upload";

function seconds(s: number) {
  if (s < 60) return `${Math.max(1, Math.round(s))}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

function statusText(i: UploadItem) {
  switch (i.status) {
    case "queued":
      return "Waiting…";
    case "optimizing":
      return "Optimizing image…";
    case "uploading":
      return `${formatBytes(i.loaded)} of ${formatBytes(i.total)}${i.speed ? ` · ${formatBytes(i.speed)}/s` : ""}${
        i.eta != null ? ` · ${seconds(i.eta)} left` : ""
      }`;
    case "saving":
      return "Saving…";
    case "done":
      return i.finalSize < i.originalSize
        ? `Done · optimized ${formatBytes(i.originalSize)} → ${formatBytes(i.finalSize)}`
        : `Done · ${formatBytes(i.finalSize)}`;
    case "cancelled":
      return "Cancelled";
    case "error":
      return i.error ?? "Upload failed.";
  }
}

function Row({
  item,
  onCancel,
  onRetry,
  onDismiss,
}: {
  item: UploadItem;
  onCancel: () => void;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const active = ["queued", "optimizing", "uploading", "saving"].includes(item.status);
  const failed = item.status === "error";

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 dark:border-white/15 dark:bg-white/[0.03]">
      <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-foreground/5">
        {item.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.preview} alt="" className="size-full object-cover" />
        ) : (
          <FileVideo className="size-5 text-muted" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[13.5px] font-semibold">{item.name}</p>
          <span className="shrink-0">
            {item.status === "done" && <CheckCircle2 className="size-4 text-emerald-500" aria-label="Uploaded" />}
            {failed && <TriangleAlert className="size-4 text-red-500" aria-label="Failed" />}
            {["optimizing", "saving"].includes(item.status) && <Loader2 className="size-4 animate-spin text-muted" aria-hidden />}
          </span>
        </div>

        {(item.status === "uploading" || item.status === "saving" || item.status === "optimizing" || item.status === "queued") && (
          <div
            role="progressbar"
            aria-label={`Uploading ${item.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={item.progress}
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${item.status === "optimizing" || item.status === "queued" ? 4 : item.progress}%` }}
            />
          </div>
        )}

        <p className={`mt-1 text-[12px] ${failed ? "text-red-600 dark:text-red-400" : "text-muted"}`}>
          {statusText(item)}
          {item.status === "uploading" && <span className="ml-1 font-semibold text-foreground">{item.progress}%</span>}
        </p>
      </div>

      {active ? (
        <button
          type="button"
          onClick={onCancel}
          aria-label={`Cancel ${item.name}`}
          title="Cancel"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : (
        <div className="flex shrink-0 items-center">
          {item.retryable && (failed || item.status === "cancelled") && (
            <button
              type="button"
              onClick={onRetry}
              aria-label={`Retry ${item.name}`}
              title="Retry"
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-foreground/5 hover:text-foreground"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label={`Dismiss ${item.name}`}
            title="Dismiss"
            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </li>
  );
}

export function MediaUploader({
  folder,
  onUploaded,
  compact = false,
}: {
  folder: MediaFolder;
  onUploaded?: (asset: MediaAsset) => void;
  compact?: boolean;
}) {
  const { items, addFiles, cancel, retry, dismiss, clearFinished } = useMediaUpload({ folder, onUploaded });
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const hasFinished = items.some((i) => ["done", "cancelled", "error"].includes(i.status));

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border bg-card dark:bg-white/[0.02]"
        } ${compact ? "px-4 py-7" : "px-6 py-10"}`}
      >
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary/10 text-primary dark:text-[#9db8ff]">
          <UploadCloud className="size-5" aria-hidden />
        </span>
        <p className="mt-3 text-[14px] font-semibold">Drag files here, or</p>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-2 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Choose files
        </button>
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          aria-label="Choose files to upload"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="mx-auto mt-4 max-w-[420px] text-[12px] leading-[1.7] text-muted">
          Images (JPG, PNG, WebP, GIF, AVIF) are shrunk to {MEDIA_RULES.image.maxDimension}px and converted to WebP
          automatically; the limit is {formatBytes(MEDIA_RULES.image.maxBytes)}. Videos (MP4, WebM) are limited to{" "}
          {formatBytes(MEDIA_RULES.video.maxBytes)}, so compress them first.
        </p>
      </div>

      {items.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <Row
                key={item.id}
                item={item}
                onCancel={() => cancel(item.id)}
                onRetry={() => retry(item.id)}
                onDismiss={() => dismiss(item.id)}
              />
            ))}
          </ul>
          {hasFinished && (
            <button
              type="button"
              onClick={clearFinished}
              className="mt-3 text-[12.5px] font-semibold text-muted transition-colors hover:text-foreground"
            >
              Clear finished
            </button>
          )}
        </div>
      )}
    </div>
  );
}

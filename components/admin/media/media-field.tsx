"use client";

import { useState } from "react";
import { ImageIcon, Link2, Trash2, Upload } from "lucide-react";
import { MediaPicker } from "./media-picker";
import { btn, inputClass } from "@/components/admin/ui";
import type { MediaFolder, MediaKind } from "@/lib/admin/media-config";

/** One media value (an image or video URL): preview + choose/upload + remove, with a paste-a-URL fallback. */
export function MediaField({
  label,
  value,
  onChange,
  kind,
  folder,
  hint,
  error,
  required,
  aspect = "aspect-[16/9]",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind: MediaKind;
  folder: MediaFolder;
  hint?: string;
  error?: string;
  required?: boolean;
  aspect?: string;
}) {
  const [picking, setPicking] = useState(false);
  const [manual, setManual] = useState(false);

  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold">
        {label}
        {required && (
          <span aria-hidden className="text-red-500">
            {" "}
            *
          </span>
        )}
      </p>

      {value ? (
        <div className={`relative overflow-hidden rounded-xl border border-border bg-foreground/5 ${aspect}`}>
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <video src={value} controls preload="metadata" className="size-full bg-black object-contain" />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPicking(true)}
          className={`grid w-full place-items-center rounded-xl border-2 border-dashed border-border bg-card text-muted transition-colors hover:border-primary hover:text-foreground ${aspect}`}
        >
          <span className="flex flex-col items-center gap-1.5 text-[13px] font-semibold">
            {kind === "image" ? <ImageIcon className="size-5" aria-hidden /> : <Upload className="size-5" aria-hidden />}
            Choose or upload {kind === "image" ? "an image" : "a video"}
          </span>
        </button>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {value && (
          <button type="button" onClick={() => setPicking(true)} className={btn("secondary", "sm")}>
            <Upload className="size-3.5" aria-hidden /> Replace
          </button>
        )}
        {value && (
          <button type="button" onClick={() => onChange("")} className={btn("ghost", "sm")}>
            <Trash2 className="size-3.5" aria-hidden /> Remove
          </button>
        )}
        <button
          type="button"
          onClick={() => setManual((v) => !v)}
          aria-expanded={manual}
          className={btn("ghost", "sm")}
        >
          <Link2 className="size-3.5" aria-hidden /> Use a URL
        </button>
      </div>

      {manual && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder={kind === "image" ? "https://media.aqstra.com/…" : "https://…/video.mp4"}
          aria-label={`${label} URL`}
          className={`${inputClass} mt-2`}
        />
      )}

      {hint && !error && <p className="mt-1.5 text-[12px] leading-[1.6] text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-[12.5px] text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <MediaPicker
        open={picking}
        kind={kind}
        folder={folder}
        onClose={() => setPicking(false)}
        onSelect={(asset) => onChange(asset.url)}
      />
    </div>
  );
}

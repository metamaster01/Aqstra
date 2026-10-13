"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { MediaLibrary } from "./media-library";
import { MediaUploader } from "./media-uploader";
import type { MediaAsset, MediaFolder, MediaKind } from "@/lib/admin/media-config";

/** Dialog to choose an existing file or upload a new one. Uploading selects the file automatically. */
export function MediaPicker({
  open,
  kind,
  folder,
  onClose,
  onSelect,
}: {
  open: boolean;
  kind: MediaKind;
  folder: MediaFolder;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<"library" | "upload">("library");

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      setTab("library");
      el.showModal();
    }
    if (!open && el.open) el.close();
  }, [open]);

  const pick = (asset: MediaAsset) => {
    onSelect(asset);
    onClose();
  };

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      className="m-auto h-[min(720px,calc(100dvh-2rem))] w-[calc(100%-1.5rem)] max-w-[860px] rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
            <div role="tablist" aria-label="Media source" className="inline-flex rounded-lg border border-border bg-card p-0.5">
              {(["library", "upload"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                    tab === t ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {t === "library" ? "Library" : "Upload new"}
                </button>
              ))}
            </div>
            <p className="hidden text-[13px] text-muted sm:block">Choose {kind === "image" ? "an image" : "a video"}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-foreground/5 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {tab === "library" ? (
              <MediaLibrary kind={kind} folder={folder} onSelect={pick} />
            ) : (
              <MediaUploader folder={folder} compact onUploaded={pick} />
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

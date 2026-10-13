"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { confirmUpload, createUpload } from "@/lib/admin/media-actions";
import { MEDIA_RULES, formatBytes, kindOf, type MediaAsset, type MediaFolder } from "@/lib/admin/media-config";

export type UploadStatus = "queued" | "optimizing" | "uploading" | "saving" | "done" | "error" | "cancelled";

export type UploadItem = {
  id: string;
  name: string;
  kind: "image" | "video" | null;
  preview: string | null; // local thumbnail while uploading
  status: UploadStatus;
  progress: number; // 0-100
  loaded: number;
  total: number;
  speed: number; // bytes / second
  eta: number | null; // seconds
  retryable: boolean; // false when the file was rejected before upload
  originalSize: number;
  finalSize: number;
  error?: string;
  asset?: MediaAsset;
};

/* --------------------------- image optimization --------------------------- */

type Prepared = { blob: Blob; type: string; name: string; width: number; height: number };

/** Shrinks big images in the browser (max 2000px, WebP) so heavy photos never reach the bucket. */
async function optimizeImage(file: File): Promise<Prepared> {
  const rule = MEDIA_RULES.image;
  const keep = (w = 0, h = 0): Prepared => ({ blob: file, type: file.type, name: file.name, width: w, height: h });

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return keep();

  const { width, height } = bitmap;
  const longest = Math.max(width, height);
  const animatedOrSpecial = file.type === "image/gif" || file.type === "image/avif";
  if (animatedOrSpecial || (file.size <= rule.optimizeAboveBytes && longest <= rule.maxDimension)) {
    bitmap.close?.();
    return keep(width, height);
  }

  const scale = Math.min(1, rule.maxDimension / longest);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", rule.quality));
  if (!blob || (blob.size >= file.size && scale === 1)) return keep(width, height);

  return { blob, type: "image/webp", name: file.name.replace(/\.[^.]+$/, "") + ".webp", width: w, height: h };
}

function videoSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    const done = (w = 0, h = 0) => {
      URL.revokeObjectURL(url);
      resolve({ width: w, height: h });
    };
    const timer = setTimeout(() => done(), 5000);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      clearTimeout(timer);
      done(video.videoWidth, video.videoHeight);
    };
    video.onerror = () => {
      clearTimeout(timer);
      done();
    };
    video.src = url;
  });
}

/* ------------------------------ the upload ------------------------------ */

function putWithProgress(
  url: string,
  body: Blob,
  headers: Record<string, string>,
  onProgress: (loaded: number, total: number) => void,
  signal: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded, e.total);
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Storage rejected the upload (${xhr.status}).`));
    xhr.onerror = () =>
      reject(new Error("Upload failed. If this keeps happening, check the bucket's CORS settings allow PUT."));
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(body);
  });
}

export function useMediaUpload({
  folder,
  onUploaded,
}: {
  folder: MediaFolder;
  onUploaded?: (asset: MediaAsset) => void;
}) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const files = useRef(new Map<string, File>());
  const controllers = useRef(new Map<string, AbortController>());
  const queue = useRef<string[]>([]);
  const running = useRef(false);
  const callback = useRef(onUploaded);
  callback.current = onUploaded;
  const folderRef = useRef(folder);
  folderRef.current = folder;

  const patch = useCallback((id: string, p: Partial<UploadItem>) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...p } : i)));
  }, []);

  const processOne = useCallback(
    async (id: string) => {
      const file = files.current.get(id);
      if (!file) return;
      const controller = new AbortController();
      controllers.current.set(id, controller);

      try {
        const kind = kindOf(file.type)!;
        let prepared: Prepared;

        if (kind === "image") {
          patch(id, { status: "optimizing", progress: 0 });
          prepared = await optimizeImage(file);
        } else {
          const { width, height } = await videoSize(file);
          prepared = { blob: file, type: file.type, name: file.name, width, height };
        }

        const limit = MEDIA_RULES[kind].maxBytes;
        if (prepared.blob.size > limit) {
          throw new Error(
            `Still ${formatBytes(prepared.blob.size)} after optimizing. The limit is ${formatBytes(limit)}. Use a smaller image.`
          );
        }
        if (controller.signal.aborted) throw new DOMException("Aborted", "AbortError");

        patch(id, { status: "uploading", total: prepared.blob.size, finalSize: prepared.blob.size, progress: 0 });

        const presign = await createUpload({
          name: prepared.name,
          type: prepared.type,
          size: prepared.blob.size,
          folder: folderRef.current,
        });
        if (!presign.ok) throw new Error(presign.error);

        const startedAt = Date.now();
        await putWithProgress(
          presign.uploadUrl,
          prepared.blob,
          presign.headers,
          (loaded, total) => {
            const seconds = (Date.now() - startedAt) / 1000;
            const speed = seconds > 0.2 ? loaded / seconds : 0;
            patch(id, {
              loaded,
              total,
              progress: Math.min(99, Math.round((loaded / total) * 100)),
              speed,
              eta: speed > 0 ? (total - loaded) / speed : null,
            });
          },
          controller.signal
        );

        patch(id, { status: "saving", progress: 99, eta: null });
        const saved = await confirmUpload({
          key: presign.key,
          name: prepared.name,
          type: prepared.type,
          folder: folderRef.current,
          width: prepared.width,
          height: prepared.height,
        });
        if (!saved.ok) throw new Error(saved.error);

        patch(id, { status: "done", progress: 100, asset: saved.asset });
        callback.current?.(saved.asset);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          patch(id, { status: "cancelled" });
        } else {
          patch(id, { status: "error", error: err instanceof Error ? err.message : "Upload failed." });
        }
      } finally {
        controllers.current.delete(id);
      }
    },
    [patch]
  );

  const pump = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    while (queue.current.length) {
      const id = queue.current.shift()!;
      await processOne(id);
    }
    running.current = false;
  }, [processOne]);

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const added: UploadItem[] = [];
      for (const file of Array.from(list)) {
        const id = crypto.randomUUID();
        const kind = kindOf(file.type);
        let error: string | undefined;
        if (!kind) {
          error = "Unsupported type. Use JPG, PNG, WebP, GIF, AVIF, MP4 or WebM.";
        } else if (kind === "video" && file.size > MEDIA_RULES.video.maxBytes) {
          error = `${formatBytes(file.size)} is over the ${formatBytes(MEDIA_RULES.video.maxBytes)} video limit. Compress it first.`;
        } else if (kind === "image" && file.size > MEDIA_RULES.image.maxOriginalBytes) {
          error = `${formatBytes(file.size)} is too large to optimize here. Use a smaller image.`;
        }

        if (!error) files.current.set(id, file);
        added.push({
          id,
          name: file.name,
          kind,
          preview: kind === "image" && !error ? URL.createObjectURL(file) : null,
          status: error ? "error" : "queued",
          progress: 0,
          loaded: 0,
          total: file.size,
          speed: 0,
          eta: null,
          retryable: !error,
          originalSize: file.size,
          finalSize: file.size,
          error,
        });
        if (!error) queue.current.push(id);
      }
      setItems((prev) => [...added, ...prev]);
      void pump();
    },
    [pump]
  );

  const cancel = useCallback(
    (id: string) => {
      const controller = controllers.current.get(id);
      if (controller) {
        controller.abort();
        return;
      }
      queue.current = queue.current.filter((q) => q !== id);
      patch(id, { status: "cancelled" });
    },
    [patch]
  );

  const retry = useCallback(
    (id: string) => {
      if (!files.current.has(id)) return;
      patch(id, { status: "queued", progress: 0, loaded: 0, error: undefined, speed: 0, eta: null });
      queue.current.push(id);
      void pump();
    },
    [patch, pump]
  );

  const dismiss = useCallback((id: string) => {
    setItems((list) => {
      const item = list.find((i) => i.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return list.filter((i) => i.id !== id);
    });
    files.current.delete(id);
  }, []);

  const clearFinished = useCallback(() => {
    setItems((list) => {
      list.filter((i) => ["done", "cancelled"].includes(i.status) && i.preview).forEach((i) => URL.revokeObjectURL(i.preview!));
      return list.filter((i) => !["done", "cancelled"].includes(i.status));
    });
  }, []);

  // Stop everything if the component goes away mid-upload.
  useEffect(() => {
    const active = controllers.current;
    return () => active.forEach((c) => c.abort());
  }, []);

  const busy = items.some((i) => ["queued", "optimizing", "uploading", "saving"].includes(i.status));
  return { items, addFiles, cancel, retry, dismiss, clearFinished, busy };
}

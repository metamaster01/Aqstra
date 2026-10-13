/**
 * Media rules, shared by the browser (to check files early) and the server
 * (which enforces them). Change a limit here and it applies everywhere.
 *
 * Files live in R2 under:  <folder>/<images|videos>/<yyyy-mm>/<name>-<id>.<ext>
 *   e.g. resources/images/2026-10/hero-a1b2c3d4.webp
 */

export const MEDIA_FOLDERS = ["docs", "resources"] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];
export type MediaKind = "image" | "video";

export const MEDIA_RULES = {
  image: {
    maxBytes: 5 * 1024 * 1024, // after optimizing
    maxOriginalBytes: 40 * 1024 * 1024, // what we are willing to read in the browser to optimize
    types: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
    } as Record<string, string>,
    maxDimension: 2000, // longest side, px
    optimizeAboveBytes: 300 * 1024,
    quality: 0.82,
  },
  video: {
    maxBytes: 30 * 1024 * 1024,
    types: { "video/mp4": "mp4", "video/webm": "webm" } as Record<string, string>,
  },
} as const;

/** Keys are unique per upload, so files are never overwritten and can be cached for a year. */
export const CACHE_CONTROL = "public, max-age=31536000, immutable";

export const ACCEPT = [...Object.keys(MEDIA_RULES.image.types), ...Object.keys(MEDIA_RULES.video.types)].join(",");

export type MediaAsset = {
  id: string;
  key: string;
  url: string;
  kind: MediaKind;
  folder: MediaFolder;
  name: string;
  mime: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
};

export function kindOf(mime: string): MediaKind | null {
  if (mime in MEDIA_RULES.image.types) return "image";
  if (mime in MEDIA_RULES.video.types) return "video";
  return null;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

export const folderForArea = (area: "docs" | "resource"): MediaFolder => (area === "docs" ? "docs" : "resources");

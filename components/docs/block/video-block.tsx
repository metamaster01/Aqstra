import type { VideoContent } from "../../../lib/content";

export function VideoBlock({ url, poster, caption }: VideoContent) {
  return (
    <figure className="mt-2">
      <video
        src={url}
        poster={poster}
        controls
        className="w-full rounded-xl border border-border bg-card aspect-video"
      />
      {caption && <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>}
    </figure>
  );
}

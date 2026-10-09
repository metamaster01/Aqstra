import Image from "next/image";
import type { ImageContent } from "../../../lib/content";

const WIDTH_CLASS: Record<NonNullable<ImageContent["width"]>, string> = {
  full: "w-full aspect-[16/9]",
  half: "w-full sm:w-1/2 aspect-[4/3]",
  inline: "w-full max-w-md aspect-[4/3]",
};

export function ImageBlock({ url, alt, caption, width = "full" }: ImageContent) {
  return (
    <figure className="mt-2">
      <div className={`relative overflow-hidden rounded-xl border border-border bg-card ${WIDTH_CLASS[width]}`}>
        <Image src={url} alt={alt ?? ""} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
      </div>
      {caption && <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>}
    </figure>
  );
}

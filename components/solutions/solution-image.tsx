"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { SolutionImage as Img } from "@/lib/solutions";

/**
 * Framed image with a fixed aspect ratio. If the file is missing, shows a
 * neutral placeholder instead of a broken image, so pages are safe to ship
 * before every screenshot exists.
 */
export function SolutionImage({
  image,
  sizes,
  priority = false,
  className = "",
}: {
  image: Img;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The error can fire before hydration, so check once on mount as well.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-28px_rgba(37,99,235,0.35),0_2px_6px_rgba(15,23,42,0.05)] dark:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ${className}`}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      {failed ? (
        <div
          role="img"
          aria-label={image.alt}
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
        >
          <span className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full border border-primary/15" />
          <span className="pointer-events-none absolute -bottom-12 -left-8 size-44 rounded-full border border-primary/10" />
          <div className="relative px-6 text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <ImageIcon className="size-5" aria-hidden />
            </span>
            {process.env.NODE_ENV !== "production" && (
              <p className="mt-3 break-all text-[11px] text-muted">Add image: {image.src}</p>
            )}
          </div>
        </div>
      ) : (
        <Image
          ref={ref}
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

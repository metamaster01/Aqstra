"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Story } from "@/lib/news/types";
import { useNews } from "./news-provider";
import { signalMeta } from "./signals";

/** A slow marquee of the latest headlines. GSAP drives it so hover can pause it smoothly. */
export function HeadlineTicker({ stories }: { stories: Story[] }) {
  const { openStory } = useNews();
  const track = useRef<HTMLUListElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || stories.length < 3) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tween.current = gsap.to(el, { xPercent: -50, ease: "none", duration: Math.max(40, stories.length * 9), repeat: -1 });
    return () => { tween.current?.kill(); };
  }, [stories.length]);

  if (stories.length < 3) return null;
  const loop = [...stories, ...stories]; // doubled so the -50% loop is seamless

  return (
    <div
      className="relative overflow-hidden border-y border-border/70 bg-card/40 py-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      onMouseEnter={() => tween.current?.pause()} onMouseLeave={() => tween.current?.play()}
      role="region" aria-label="Latest headlines"
    >
      <ul ref={track} className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
        {loop.map((s, i) => {
          const m = signalMeta(s.signal_type);
          const Icon = m.icon;
          const dup = i >= stories.length;
          return (
            <li key={`${s.id}-${i}`} aria-hidden={dup}>
              <button type="button" tabIndex={dup ? -1 : 0} onClick={() => openStory(s)} className="group inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-foreground">
                <span className={`grid size-6 place-items-center rounded-full ring-1 ring-inset ${m.chip}`}><Icon className="size-3.5" aria-hidden /></span>
                <span className="max-w-[420px] truncate font-medium">{s.headline}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

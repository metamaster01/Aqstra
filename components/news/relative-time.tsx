"use client";

import { timeAgo } from "@/lib/news/format";

export function RelativeTime({ iso, className = "" }: { iso: string; className?: string }) {
  // The server and the browser can disagree by a few seconds; that is harmless here.
  return <time dateTime={iso} suppressHydrationWarning className={className}>{timeAgo(iso)}</time>;
}

"use client";

import { formatDateTime, timeAgo } from "@/lib/admin/inbox-format";

/**
 * A date shown in the viewer's own time zone. The server renders in UTC, so the
 * text is allowed to differ on first paint (suppressHydrationWarning) and then
 * matches the visitor's clock.
 */
export function Time({ iso, mode = "relative" }: { iso: string; mode?: "relative" | "full" }) {
  return (
    <time dateTime={iso} title={formatDateTime(iso)} suppressHydrationWarning>
      {mode === "relative" ? timeAgo(iso) : formatDateTime(iso)}
    </time>
  );
}

"use client";

import { Inbox, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export function StoryCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`animate-pulse rounded-2xl border border-border bg-card/60 p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between"><div className="h-6 w-32 rounded-full bg-foreground/10" /><div className="size-10 rounded-full bg-foreground/10" /></div>
      <div className="mb-2 h-5 w-11/12 rounded bg-foreground/10" /><div className="mb-5 h-5 w-2/3 rounded bg-foreground/10" />
      <div className="mb-2 h-3 w-full rounded bg-foreground/10" /><div className="mb-2 h-3 w-full rounded bg-foreground/10" /><div className="mb-5 h-3 w-4/5 rounded bg-foreground/10" />
      <div className="h-16 rounded-xl bg-foreground/[0.06]" />
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><Inbox className="size-6" aria-hidden /></div>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function RetryButton({ onClick, label = "Try again" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-hover">
      <RefreshCw className="size-4" aria-hidden /> {label}
    </button>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ROLLING_PAGE } from "@/lib/news/config";
import type { FeedPage, Industry } from "@/lib/news/types";
import { FilterBar } from "./filter-bar";
import { useNews } from "./news-provider";
import { EmptyState, RetryButton, StoryCardSkeleton } from "./states";
import { StoryCard } from "./story-card";
import { useFeed } from "./use-feed";

export function RollingFeed({ initial, industries }: { initial: FeedPage; industries: Industry[] }) {
  const { scope, industry, clearFilters } = useNews();
  const { items, status, hasMore, loadingMore, loadMore, retry } = useFeed({ section: "rolling", scope, industry, pageSize: ROLLING_PAGE, initial });
  const sentinel = useRef<HTMLDivElement>(null);

  // Auto-load the next page shortly before the visitor reaches the bottom.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver((e) => e[0]?.isIntersecting && loadMore(), { rootMargin: "500px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore, items.length]);

  const key = `${scope ?? "all"}-${industry ?? "all"}`;
  const filtered = scope !== null || industry !== null;

  return (
    <div>
      <FilterBar industries={industries} />
      <p className="sr-only" aria-live="polite">{status === "loading" ? "Loading signals" : `${items.length} signals shown`}</p>

      <div className="pt-8">
        {status === "loading" && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <StoryCardSkeleton key={i} />)}</div>
        )}

        {status === "error" && (
          <EmptyState title="Couldn't load signals" body="Something went wrong on our side. Your filters are still set." action={<RetryButton onClick={retry} />} />
        )}

        {status === "idle" && items.length === 0 && (
          <EmptyState
            title={filtered ? "No signals match these filters yet" : "Fresh signals are on their way"}
            body={filtered ? "Try a wider region or another industry. New stories arrive every few hours." : "We refresh the news every few hours. Check back soon."}
            action={filtered ? <button type="button" onClick={clearFilters} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary">Clear filters</button> : undefined}
          />
        )}

        {status === "idle" && items.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: Math.min(i % ROLLING_PAGE, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}>
                  <StoryCard story={s} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div ref={sentinel} className="mt-10 flex h-12 items-center justify-center">
          {loadingMore && <Loader2 className="size-5 animate-spin text-primary" aria-label="Loading more" />}
          {hasMore && !loadingMore && status === "idle" && (
            <button type="button" onClick={loadMore} className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary">Show more signals</button>
          )}
          {!hasMore && items.length > ROLLING_PAGE && <p className="text-sm text-muted">You're all caught up.</p>}
        </div>
      </div>
    </div>
  );
}

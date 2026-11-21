"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Cursor, FeedPage, FeedSection, Scope, Story } from "@/lib/news/types";

interface Options {
  section: Exclude<FeedSection, "featured">;
  scope: Scope | null;
  industry: string | null;
  pageSize: number;
  /** Server-rendered first page, used as-is while no filter is active (no refetch, no flash). */
  initial?: FeedPage;
  /** Lazy sections (the archive) only fetch once this is true. */
  enabled?: boolean;
}

export function useFeed({ section, scope, industry, pageSize, initial, enabled = true }: Options) {
  const useInitial = !!initial && !scope && !industry;
  const [items, setItems] = useState<Story[]>(useInitial ? initial!.items : []);
  const [next, setNext] = useState<Cursor | null>(useInitial ? initial!.next : null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(useInitial ? "idle" : "loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [nonce, setNonce] = useState(0);
  const generation = useRef(0);

  const urlFor = useCallback(
    (cursor?: Cursor | null) => {
      const p = new URLSearchParams({ section, limit: String(pageSize) });
      if (scope) p.set("scope", scope);
      if (industry) p.set("industry", industry);
      if (cursor) { p.set("beforeTs", cursor.ts); p.set("beforeId", cursor.id); }
      return `/api/news/feed?${p}`;
    },
    [section, pageSize, scope, industry],
  );

  useEffect(() => {
    if (!enabled) return;
    if (useInitial && nonce === 0) {
      setItems(initial!.items); setNext(initial!.next); setStatus("idle");
      return;
    }
    const ac = new AbortController();
    const gen = ++generation.current;
    setStatus("loading"); setItems([]); setNext(null);
    fetch(urlFor(), { signal: ac.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<FeedPage>; })
      .then((d) => { if (gen !== generation.current) return; setItems(d.items); setNext(d.next); setStatus("idle"); })
      .catch(() => { if (!ac.signal.aborted && gen === generation.current) setStatus("error"); });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, useInitial, urlFor, nonce]);

  const loadMore = useCallback(() => {
    if (!next || loadingMore || status !== "idle") return;
    const gen = generation.current;
    setLoadingMore(true);
    fetch(urlFor(next))
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<FeedPage>; })
      .then((d) => {
        if (gen !== generation.current) return;
        setItems((prev) => { const seen = new Set(prev.map((s) => s.id)); return [...prev, ...d.items.filter((s) => !seen.has(s.id))]; });
        setNext(d.next);
      })
      .catch(() => { /* keep what we have; the button stays so the visitor can retry */ })
      .finally(() => setLoadingMore(false));
  }, [next, loadingMore, status, urlFor]);

  return { items, status, hasMore: next !== null, loadingMore, loadMore, retry: () => setNonce((n) => n + 1) };
}

"use client";

import { RetryButton } from "@/components/news/states";

export default function NewsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-[60svh] max-w-xl place-items-center px-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-extrabold">News is taking a break</h1>
        <p className="mt-3 text-muted">Something went wrong loading this page. It usually clears up in a minute.</p>
        <div className="mt-6"><RetryButton onClick={reset} label="Reload" /></div>
      </div>
    </div>
  );
}

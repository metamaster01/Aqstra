"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Circle, Loader2 } from "lucide-react";
import { domainsScannedFor } from "@/lib/demo/industries";

const MIN_MS = 3800; // the "work" takes a moment, even when the answer is instant

export function Analyzing({ industryId, ready, onDone }: { industryId: string; ready: boolean; onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const animationContainer = useRef<HTMLDivElement>(null);
  const started = useRef(0);
  const readyRef = useRef(ready);
  const doneRef = useRef(onDone);
  const fired = useRef(false);
  readyRef.current = ready;
  doneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    let animation: import("lottie-web").AnimationItem | undefined;

    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !animationContainer.current) return;

      animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/search.json",
      });
    });

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, []);

  useEffect(() => {
    started.current = performance.now();
    const timer = setInterval(() => {
      const elapsed = performance.now() - started.current;
      // Creep towards 92%, then wait for the results to land before finishing.
      const target = readyRef.current && elapsed >= MIN_MS ? 100 : Math.min(92, (elapsed / MIN_MS) * 92);
      setPct((p) => (p < target ? Math.min(target, p + 1.7) : p));
    }, 40);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pct >= 100 && !fired.current) {
      fired.current = true;
      setTimeout(() => doneRef.current(), 450); // let the bar visibly finish
    }
  }, [pct]);

  const steps = [
    { text: `Identified ${domainsScannedFor(industryId).toLocaleString("en-US")} potential organization domains`, at: 30 },
    { text: "Verifying decision-maker job titles & seniority", at: 66 },
    { text: "Calculating deliverability confidence scores", at: 98 },
  ];
  const activeIndex = steps.findIndex((s) => pct < s.at);

  return (
    <div className="mx-auto max-w-[520px] text-center">
      <div
        ref={animationContainer}
        aria-hidden="true"
        className="mx-auto mb-6 aspect-[16/9] w-full max-w-[320px] overflow-hidden"
      />

      <h2 className="font-display font-extrabold tracking-tight text-foreground" style={{ margin: 0, fontSize: "clamp(26px, 4vw, 34px)", lineHeight: 1.15 }}>
        Analyzing your target market…
      </h2>
      <p className="mx-auto mt-3 max-w-[400px] text-[14.5px] leading-[1.7] text-muted">
        AQSTRA is matching sample companies and decision-makers to your selected criteria.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-left shadow-[0_24px_60px_-34px_rgba(37,99,235,0.35)] dark:border-white/15 dark:bg-white/[0.04] dark:shadow-none sm:p-6">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          <span>Target alignment process</span>
          <span className="text-primary dark:text-[#9db8ff]" aria-hidden>
            {Math.round(pct)}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Analysis progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/10"
        >
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#60a5fa]" style={{ width: `${pct}%` }} />
        </div>

        <ul className="mt-5 space-y-3.5">
          {steps.map((s, i) => {
            const complete = pct >= s.at;
            const active = !complete && i === activeIndex;
            return (
              <li
                key={s.text}
                className={`flex items-center gap-3 text-[13px] transition-colors ${
                  complete ? "text-foreground" : active ? "text-foreground/80" : "text-muted/60"
                }`}
              >
                <span className="grid size-5 shrink-0 place-items-center">
                  {complete ? (
                    <Check className="size-4 text-primary dark:text-[#9db8ff]" strokeWidth={3} aria-label="Done" />
                  ) : active ? (
                    <Loader2 className="size-4 animate-spin text-primary motion-reduce:animate-none dark:text-[#9db8ff]" aria-label="In progress" />
                  ) : (
                    <Circle className="size-4" aria-label="Waiting" />
                  )}
                </span>
                {s.text}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

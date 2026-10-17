"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Lock, X } from "lucide-react";
import { trackDemoEvent } from "./track";

export function UnlockDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="unlock-title"
      className="m-auto w-[calc(100%-2rem)] max-w-[400px] rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-[2px] dark:border-white/15"
    >
      <div className="relative p-7 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-border text-muted transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary dark:text-[#9db8ff]">
          <Lock className="size-5" aria-hidden />
        </span>
        <h2 id="unlock-title" className="mt-5 font-display font-bold tracking-tight" style={{ margin: "20px 0 0", fontSize: 22 }}>
          Login to Unlock
        </h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-muted">
          This contact detail is available to registered AQSTRA users. Log in to continue exploring full prospect intelligence.
        </p>

        <div className="mt-6 space-y-2.5">
          <Link
            href="/login"
            onClick={() => trackDemoEvent("login_click")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Log in to AQSTRA <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/pricing"
            onClick={() => trackDemoEvent("plans_click")}
            className="flex w-full items-center justify-center rounded-lg border border-border px-5 py-3 text-[14px] font-semibold transition-colors hover:border-primary"
          >
            View Subscription Plans
          </Link>
        </div>

        <p className="mt-5 text-center text-[12.5px] text-muted">
          New to AQSTRA?{" "}
          <Link href="/pricing" onClick={() => trackDemoEvent("plans_click")} className="font-semibold text-primary hover:underline dark:text-[#9db8ff]">
            Explore subscription options
          </Link>
        </p>
      </div>
    </dialog>
  );
}

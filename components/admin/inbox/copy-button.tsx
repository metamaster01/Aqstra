"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers, or a page without clipboard permission: fall back to a hidden textarea.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const done = document.execCommand("copy");
      document.body.removeChild(area);
      return done;
    } catch {
      return false;
    }
  }
}

/** Copies a value (an email, a phone number) and says so. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    const done = await writeToClipboard(value);
    setState(done ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        state === "copied"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : state === "failed"
            ? "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400"
            : "border-border bg-background text-muted hover:border-primary hover:text-foreground"
      }`}
    >
      {state === "copied" ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : "Copy"}
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? `${label} copied` : ""}
      </span>
    </button>
  );
}

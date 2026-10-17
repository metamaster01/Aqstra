import { Check, X } from "lucide-react";
import { CopyButton } from "./copy-button";
import { initialsOf } from "@/lib/admin/inbox-format";

const TONES = ["bg-[#2563eb]", "bg-[#7c3aed]", "bg-[#db2777]", "bg-[#0d9488]", "bg-[#f59e0b]", "bg-[#0891b2]", "bg-[#e11d48]", "bg-[#4f46e5]"];

export function Avatar({ name }: { name: string }) {
  const tone = TONES[(name.charCodeAt(0) + name.length) % TONES.length];
  return (
    <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white ${tone}`}>
      {initialsOf(name)}
    </span>
  );
}

/** One labelled value. Pass `copy` to add a Copy button (used for emails and phone numbers). */
export function DetailRow({ label, value, copy }: { label: string; value?: string | null; copy?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">{label}</p>
        <p className={`mt-0.5 break-words text-[14px] ${value ? "text-foreground" : "text-muted"}`}>{value || "Not provided"}</p>
      </div>
      {copy && value ? <CopyButton value={value} label={label.toLowerCase()} /> : null}
    </div>
  );
}

/** "Team alert: sent / not sent" style flag. */
export function Delivery({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12.5px] ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
      {ok ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
      {label}: {ok ? "sent" : "not sent"}
    </span>
  );
}

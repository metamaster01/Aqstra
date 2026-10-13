"use client";

import { useRef, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { ActionForm } from "./action-form";
import { btn } from "./ui";
import type { ActionResult } from "@/lib/admin/result";

/**
 * A button that asks "are you sure?" in a dialog, then runs a Server Action.
 * Uses the native <dialog> element: focus trapping, Esc to close and a
 * backdrop come for free, with no extra library.
 */
export function ConfirmAction({
  action,
  fields,
  title,
  message,
  confirmLabel,
  trigger,
  triggerLabel,
  triggerClassName,
  onDone,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  fields: Record<string, string>;
  title: string;
  message: string;
  confirmLabel: string;
  trigger: ReactNode;
  triggerLabel: string;
  triggerClassName: string;
  onDone?: (result: ActionResult) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={triggerLabel}
        title={triggerLabel}
        className={triggerClassName}
      >
        {trigger}
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close(); // click on the backdrop
        }}
        className="w-[calc(100%-2rem)] max-w-[420px] rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/50"
      >
        <ActionForm action={action} onDone={(r) => {
            if (!r.ok) return;
            dialog.current?.close();
            onDone?.(r);
          }} className="p-6">
          {(pending) => (
            <>
              {Object.entries(fields).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <h2 className="font-display text-[18px] font-bold tracking-tight" style={{ margin: 0, fontSize: 18 }}>
                {title}
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-muted">{message}</p>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => dialog.current?.close()} className={btn("secondary")}>
                  Cancel
                </button>
                <button type="submit" disabled={pending} className={btn("danger")}>
                  {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                  {confirmLabel}
                </button>
              </div>
            </>
          )}
        </ActionForm>
      </dialog>
    </>
  );
}

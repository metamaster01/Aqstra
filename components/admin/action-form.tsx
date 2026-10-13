"use client";

import { useTransition, type FormEvent, type ReactNode } from "react";
import { useToast } from "./toast";
import type { ActionResult } from "@/lib/admin/result";

/**
 * <form> that runs a Server Action, toasts its result, and exposes `pending`
 * to its children. The one pattern every admin mutation uses.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  onDone,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: (pending: boolean) => ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  onDone?: (result: ActionResult) => void;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // capture now: it is gone after the first await
    const data = new FormData(form);

    startTransition(async () => {
      const result = await action(data);
      if (result.ok) {
        if (result.message) toast.show("success", result.message);
        if (resetOnSuccess) form.reset();
      } else {
        toast.show("error", result.error);
      }
      onDone?.(result);
    });
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      {children(pending)}
    </form>
  );
}

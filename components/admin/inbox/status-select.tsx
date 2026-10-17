"use client";

import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/components/admin/toast";
import { inputClass } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/admin/result";

/** A dropdown that saves as soon as it changes, and puts the old value back if saving fails. */
export function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: string;
  value: string;
  options: readonly { value: string; label: string }[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  useEffect(() => setCurrent(value), [value]);

  function change(next: string) {
    const previous = current;
    setCurrent(next);
    startTransition(async () => {
      const data = new FormData();
      data.set("id", id);
      data.set("status", next);
      const result = await action(data);
      if (result.ok) {
        toast.show("success", result.message ?? "Status updated.");
      } else {
        setCurrent(previous);
        toast.show("error", result.error);
      }
    });
  }

  return (
    <select
      aria-label="Status"
      value={current}
      disabled={pending}
      onChange={(e) => change(e.target.value)}
      className={`${inputClass} w-auto min-w-[140px] disabled:opacity-60`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

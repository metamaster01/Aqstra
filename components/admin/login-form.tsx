"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn, TriangleAlert } from "lucide-react";
import { signIn, type LoginState } from "@/app/admin/login/actions";

const INPUT =
  "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition " +
  "placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15";

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {notice && !state.error && (
        <p role="status" className="rounded-lg border border-border bg-foreground/[0.04] px-3.5 py-2.5 text-[13px] text-muted">
          {notice}
        </p>
      )}

      {state.error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-[13px] leading-[1.6] text-red-700 dark:text-red-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-foreground">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" inputMode="email" required autoFocus className={INPUT} />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-foreground">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${INPUT} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Signing in…
          </>
        ) : (
          <>
            Sign in <LogIn className="size-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

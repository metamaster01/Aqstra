"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Loader2, TriangleAlert } from "lucide-react";
import { GOALS } from "@/lib/demo/config";
import { emailProblem, validateDemoRequest, type DemoRequestErrors } from "@/lib/demo/request";

type Values = { fullName: string; email: string; phone: string; goal: string };
const EMPTY: Values = { fullName: "", email: "", phone: "", goal: "" };

const INPUT =
  "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition " +
  "placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/15 " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px] font-semibold text-foreground">
        <span>
          {label}
          {required && (
            <span aria-hidden className="text-red-500">
              {" "}
              *
            </span>
          )}
        </span>
        {!required && <span className="text-[11.5px] font-normal text-muted">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[12.5px] leading-[1.5] text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[12px] text-muted">{hint}</p>
      )}
    </div>
  );
}

export function RequestForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<DemoRequestErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "redirecting" | "error">("idle");
  const [trap, setTrap] = useState(""); // honeypot
  const startedAt = useRef(Date.now());

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const bind = (key: "fullName" | "email" | "phone") => ({
    id: key,
    name: key,
    value: values[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => set(key, e.target.value),
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  // Tell people straight away if they typed a personal address, not after the whole form.
  const checkEmailOnBlur = () => {
    if (!values.email.trim()) return;
    const problem = emailProblem(values.email);
    if (problem) setErrors((p) => ({ ...p, email: problem }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending" || status === "redirecting") return;

    // Submitting is the consent, as the line under the button says.
    const result = validateDemoRequest({ ...values, consent: true });
    if (!result.ok) {
      setErrors(result.errors);
      document.getElementById(Object.keys(result.errors)[0])?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/demo/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: trap, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("redirecting");
        router.push("/demo");
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      throw new Error("failed");
    } catch {
      setStatus("error");
    }
  }

  const busy = status === "sending" || status === "redirecting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_70px_-36px_rgba(37,99,235,0.45),0_2px_6px_rgba(15,23,42,0.05)] dark:border-white/15 dark:bg-white/[0.04] dark:shadow-none"
    >
      <div aria-hidden className="h-1 bg-gradient-to-r from-primary via-[#60a5fa] to-primary" />

      <div className="p-6 sm:p-8">
        <h2 className="font-display font-bold tracking-tight text-foreground" style={{ margin: 0, fontSize: 22 }}>
          Request a Demo
        </h2>
        <p className="mt-1.5 text-[14px] leading-[1.65] text-muted">
          Tell us a little about you and we&apos;ll set up your interactive walkthrough.
        </p>

        <div className="mt-6 space-y-4">
          <Field id="fullName" label="Full Name" required error={errors.fullName}>
            <input type="text" autoComplete="name" placeholder="Jane Smith" className={INPUT} {...bind("fullName")} />
          </Field>

          <Field id="email" label="Work Email" required error={errors.email} hint="Business email addresses only.">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="jane@company.com"
              className={INPUT}
              onBlur={checkEmailOnBlur}
              {...bind("email")}
            />
          </Field>

          <Field id="phone" label="Phone Number" error={errors.phone}>
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 000 0000" className={INPUT} {...bind("phone")} />
          </Field>

          <Field id="goal" label="Primary Business Goal" error={errors.goal}>
            <div className="relative">
              <select
                id="goal"
                name="goal"
                value={values.goal}
                onChange={(e) => set("goal", e.target.value)}
                aria-invalid={errors.goal ? true : undefined}
                aria-describedby={errors.goal ? "goal-error" : undefined}
                className={`${INPUT} appearance-none pr-10 ${values.goal ? "" : "text-muted/60"}`}
              >
                <option value="">What do you want to achieve?</option>
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </div>
          </Field>
        </div>

        {/* Honeypot: hidden from people and screen readers */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
          </label>
        </div>

        {status === "error" && (
          <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-[13px] leading-[1.6] text-red-700 dark:text-red-300">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>We couldn&apos;t start your demo just now. Please try again in a moment.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(37,99,235,.65)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-80"
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {status === "redirecting" ? "Opening your demo…" : "Setting things up…"}
            </>
          ) : (
            <>
              Request a Demo <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>

        <p className="mt-4 text-center text-[12px] leading-[1.7] text-muted">
          By submitting this form, you agree to our{" "}
          <Link href="/privacy-policy" className="font-semibold text-foreground/80 underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-semibold text-foreground/80 underline-offset-2 hover:underline">
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

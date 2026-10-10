"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Loader2, Send, TriangleAlert } from "lucide-react";
import {
  COMPANY_SIZES,
  CONTACT,
  TOPICS,
  validateContact,
  type ContactErrors,
  type TopicValue,
} from "@/lib/contact";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  companySize: string;
  topic: TopicValue;
  message: string;
  consent: boolean;
};

const empty = (topic: TopicValue): Values => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  companySize: "",
  topic,
  message: "",
  consent: false,
});

const INPUT =
  "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition " +
  "placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

function Field({
  id,
  label,
  required,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
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
        {hint && <span className="text-[11.5px] font-normal text-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[12.5px] text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ defaultTopic }: { defaultTopic: TopicValue }) {
  const [values, setValues] = useState<Values>(() => empty(defaultTopic));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [trap, setTrap] = useState(""); // honeypot: real people never fill this
  const startedAt = useRef(Date.now());

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const bind = (key: "firstName" | "lastName" | "email" | "phone" | "company") => ({
    id: key,
    name: key,
    value: values[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => set(key, e.target.value),
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    const result = validateContact(values);
    if (!result.ok) {
      setErrors(result.errors);
      const first = Object.keys(result.errors)[0];
      document.getElementById(first)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: trap, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setConfirmationSent(Boolean(data.confirmation));
        setStatus("sent");
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      throw new Error("send failed");
    } catch {
      setStatus("error");
    }
  }

  const reset = () => {
    setValues(empty(defaultTopic));
    setErrors({});
    setStatus("idle");
    startedAt.current = Date.now();
  };

  /* ------------------------------- success ------------------------------- */
  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border bg-card p-8 text-center shadow-[0_24px_60px_-34px_rgba(37,99,235,0.35)] sm:p-12 dark:border-white/15 dark:bg-white/[0.03]"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 className="mt-5 font-display text-[24px] font-bold tracking-[-0.02em] text-foreground">
          Thanks, {values.firstName}. We&apos;ve got it.
        </h2>
        <p className="mx-auto mt-3 max-w-[380px] text-[14.5px] leading-[1.7] text-muted">
          Our team will get back to you {CONTACT.responseTime}.
          {confirmationSent && (
            <>
              {" "}
              A confirmation is on its way to <strong className="break-all text-foreground">{values.email}</strong>.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary"
        >
          Send another message
        </button>
      </div>
    );
  }

  /* -------------------------------- form --------------------------------- */
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-2xl border border-border bg-card p-5 shadow-[0_24px_60px_-34px_rgba(37,99,235,0.35)] sm:p-8 dark:border-white/15 dark:bg-white/[0.03] dark:shadow-none"
    >
      <h2 className="font-display text-[22px] font-bold tracking-[-0.02em] text-foreground">Send us a message</h2>
      <p className="mt-1.5 text-[13.5px] text-muted">Fields marked * are required.</p>

      <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" required error={errors.firstName}>
          <input type="text" autoComplete="given-name" className={INPUT} {...bind("firstName")} />
        </Field>
        <Field id="lastName" label="Last name" required error={errors.lastName}>
          <input type="text" autoComplete="family-name" className={INPUT} {...bind("lastName")} />
        </Field>

        <Field id="email" label="Work email" required error={errors.email}>
          <input type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" className={INPUT} {...bind("email")} />
        </Field>
        <Field id="phone" label="Phone" hint="Optional" error={errors.phone}>
          <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 000 0000" className={INPUT} {...bind("phone")} />
        </Field>

        <Field id="company" label="Company" required error={errors.company}>
          <input type="text" autoComplete="organization" className={INPUT} {...bind("company")} />
        </Field>
        <Field id="companySize" label="Company size" hint="Optional" error={errors.companySize}>
          <div className="relative">
            <select
              id="companySize"
              name="companySize"
              value={values.companySize}
              onChange={(e) => set("companySize", e.target.value)}
              className={`${INPUT} appearance-none pr-10`}
            >
              <option value="">Select…</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} employees
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        </Field>
      </div>

      {/* Topic pills */}
      <fieldset className="mt-5">
        <legend className="mb-2 text-[13px] font-semibold text-foreground">What can we help with?</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t.value}
                checked={values.topic === t.value}
                onChange={() => set("topic", t.value)}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:border-primary hover:text-foreground peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background dark:peer-checked:text-[#9db8ff]">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        id="message"
        label="Message"
        required
        error={errors.message}
        hint={`${values.message.length}/2000`}
        className="mt-5"
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={2000}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Tell us about your team, the lead sources you use and what you'd like to improve."
          className={`${INPUT} h-auto min-h-[130px] resize-y py-3 leading-relaxed`}
        />
      </Field>

      {/* Consent */}
      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[1.6] text-muted">
          <input
            id="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
          />
          <span>
            I agree to the{" "}
            <Link href="/privacy-policy" className="font-semibold text-primary underline-offset-2 hover:underline dark:text-[#9db8ff]">
              Privacy Policy
            </Link>{" "}
            and to being contacted about my request.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-1.5 text-[12.5px] text-red-600 dark:text-red-400">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Honeypot (hidden from people and screen readers) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      {status === "error" && (
        <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-[13px] leading-[1.6] text-red-700 dark:text-red-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            Something went wrong sending your message. Please try again, or email us at{" "}
            <a href={`mailto:${CONTACT.salesEmail}`} className="font-semibold underline">
              {CONTACT.salesEmail}
            </a>
            .
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          <>
            Send message <Send className="size-4" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

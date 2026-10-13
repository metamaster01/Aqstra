import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* Shared admin styles + tiny presentational pieces. No hooks, so it works in server and client components. */

type Variant = "primary" | "secondary" | "ghost" | "danger";

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all " +
  "disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const BTN_VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
  secondary: "border border-border bg-card text-foreground hover:border-primary",
  ghost: "text-muted hover:bg-foreground/5 hover:text-foreground",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const btn = (variant: Variant = "secondary", size: "sm" | "md" = "md") =>
  `${BTN_BASE} ${BTN_VARIANT[variant]} ${size === "sm" ? "px-3 py-1.5 text-[13px]" : "px-4 py-2.5 text-sm"}`;

export const iconBtn =
  "grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-foreground/5 hover:text-foreground " +
  "disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition " +
  "placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15";

export const cardClass = "rounded-2xl border border-border bg-card dark:border-white/15 dark:bg-white/[0.03]";

const TONES = {
  neutral: "bg-foreground/[0.07] text-muted",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  info: "bg-primary/10 text-primary dark:text-[#9db8ff]",
  danger: "bg-red-500/10 text-red-700 dark:text-red-400",
} as const;

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold leading-5 ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 sm:mb-9">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {/* inline size: a global h1 rule in the site CSS can override utility classes */}
          <h1
            className="font-display font-extrabold text-foreground"
            style={{ fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}
          >
            {title}
          </h1>
          {description && <p className="mt-1.5 max-w-[620px] text-[14px] leading-[1.7] text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center dark:bg-white/[0.02]">
      <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary/10 text-primary dark:text-[#9db8ff]">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="mt-4 font-display text-[17px] font-bold">{title}</p>
      {text && <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] leading-[1.65] text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(iso));
}

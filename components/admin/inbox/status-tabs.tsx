import Link from "next/link";

/** All / New / ... tabs with counts. Plain links, so they work without JavaScript and can be shared. */
export function StatusTabs({
  basePath,
  active,
  tabs,
  keep = {},
}: {
  basePath: string;
  active: string;
  tabs: { value: string; label: string; count: number }[];
  keep?: Record<string, string>; // other filters to carry over (search, topic)
}) {
  const href = (value: string) => {
    const params = new URLSearchParams();
    Object.entries(keep).forEach(([k, v]) => v && params.set(k, v));
    if (value !== "all") params.set("status", value);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-1.5">
      {tabs.map((t) => {
        const on = t.value === active;
        return (
          <Link
            key={t.value}
            href={href(t.value)}
            aria-current={on ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted hover:border-primary hover:text-foreground"
            }`}
          >
            {t.label}
            <span className={`rounded-md px-1.5 text-[11px] ${on ? "bg-white/20" : "bg-foreground/10"}`}>{t.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}

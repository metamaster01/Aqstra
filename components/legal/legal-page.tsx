import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { LEGAL, type LegalSection } from "../../lib/legal";
import { LegalToc } from "./legal-toc";

// Inline sizes: a global h1/h2 rule in the site CSS can override utility classes.
const h1Style = {
  fontSize: "clamp(32px, 5vw, 48px)",
  lineHeight: 1.1,
  letterSpacing: "-0.03em",
  margin: 0,
} as const;
const h2Style = { fontSize: "clamp(19px, 2.2vw, 22px)", lineHeight: 1.25, letterSpacing: "-0.015em", margin: 0 } as const;

export function LegalPage({
  title,
  intro,
  sections,
  sibling,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  /** Link to the other legal page, shown at the bottom. */
  sibling: { label: string; href: string };
}) {
  const toc = sections.map(({ id, title }) => ({ id, title }));

  return (
    <main className="bg-background">
      {/* ------------------------------ Header ------------------------------ */}
      <header className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] to-background dark:hidden" />
          <div className="absolute inset-0 hidden dark:block">
            <div className="absolute -top-32 left-1/2 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-[#3a3690]/35 blur-[120px]" />
          </div>
        </div>

        <div className="mx-auto max-w-[1100px] px-6 pb-10 pt-14 sm:px-10 sm:pb-14 sm:pt-20">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary dark:text-white">
            Legal
          </p>
          <h1 className="font-display font-extrabold text-foreground" style={h1Style}>
            {title}
          </h1>
          <p className="mt-4 max-w-[620px] text-[15px] leading-[1.75] text-muted sm:text-[16.5px]">{intro}</p>
          <p className="mt-5 text-[13px] text-muted">
            Last updated: <time>{LEGAL.updated}</time>
          </p>
        </div>
      </header>

      {/* ------------------------------ Body ------------------------------ */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
        {/* Mobile / tablet: collapsible contents (no JS needed) */}
        <details className="group rounded-xl border border-border bg-card lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            On this page
            <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <ul className="border-t border-border px-2 py-2">
            {toc.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  className="block rounded-lg px-3 py-2 text-[13.5px] text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {i.title}
                </a>
              </li>
            ))}
          </ul>
        </details>

        {/* Desktop: sticky contents */}
        <aside className="hidden lg:block">
          <LegalToc items={toc} />
        </aside>

        <article className="min-w-0 max-w-[720px]">
          <div className="space-y-10 sm:space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display font-bold text-foreground" style={h2Style}>
                  {s.title}
                </h2>
                <div className="mt-3 space-y-4">
                  {s.blocks.map((b, i) =>
                    b.kind === "p" ? (
                      <p key={i} className="text-[15px] leading-[1.8] text-foreground/80 [overflow-wrap:anywhere]">
                        {b.text}
                      </p>
                    ) : (
                      <ul key={i} className="space-y-2.5 text-[15px] leading-[1.75] text-foreground/80">
                        {b.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-primary/70" />
                            <span className="[overflow-wrap:anywhere]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="text-sm text-muted">Also read our {sibling.label}.</p>
            <Link
              href={sibling.href}
              className="inline-flex w-fit items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {sibling.label}
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

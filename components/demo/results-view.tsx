"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, ChevronLeft, ChevronRight, Lock, Search, Users } from "lucide-react";
import { UnlockDialog } from "./unlock-dialog";
import { trackDemoEvent } from "./track";
import { PAGE_SIZE } from "@/lib/demo/config";
import type { DemoCompany, DemoLead, DemoSearchResult } from "@/lib/demo/types";

const TONES = ["bg-[#2563eb]", "bg-[#7c3aed]", "bg-[#db2777]", "bg-[#0d9488]", "bg-[#f59e0b]", "bg-[#0891b2]", "bg-[#e11d48]", "bg-[#4f46e5]"];
const FILTERS = [
  { id: "all", label: "All" },
  { id: "decision", label: "Decision Makers" },
  { id: "verified", label: "Verified Email" },
  { id: "intent", label: "High Intent" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

function Avatar({ initials, tone, className = "size-9 text-[12px]" }: { initials: string; tone: number; className?: string }) {
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-lg font-bold text-white ${TONES[tone % TONES.length]} ${className}`}>
      {initials}
    </span>
  );
}

/** The email is already masked by the server; the lock and blur are just presentation. */
function LockedEmail({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted">
      <Lock aria-hidden className="size-3.5 shrink-0" />
      <span aria-hidden className="select-none truncate blur-[3.5px]">
        {value}
      </span>
      <span className="sr-only">Email hidden. Log in to unlock.</span>
    </span>
  );
}

function UnlockButton({ onClick, name }: { onClick: () => void; name: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Log in to unlock ${name}'s contact details`}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/15 dark:text-[#9db8ff]"
    >
      <Lock className="size-3" aria-hidden /> Login to Unlock
    </button>
  );
}

function Tags({ lead }: { lead: DemoLead }) {
  if (!lead.decisionMaker && lead.intent !== "high") return null;
  return (
    <span className="mt-1 flex flex-wrap gap-1">
      {lead.decisionMaker && <span className="rounded bg-foreground/[0.07] px-1.5 py-0.5 text-[10px] font-semibold text-muted">Decision maker</span>}
      {lead.intent === "high" && <span className="rounded bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">High intent</span>}
    </span>
  );
}

/* --------------------------------- tables --------------------------------- */

function LeadsTable({ leads, onUnlock }: { leads: DemoLead[]; onUnlock: (l: DemoLead) => void }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              {["Name", "Email", "Country", "Company", "Designation", "Access"].map((h) => (
                <th key={h} className="px-4 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((l) => (
              <tr key={l.id} className="transition-colors hover:bg-foreground/[0.02]">
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-3">
                    <Avatar initials={l.initials} tone={l.tone} />
                    <span className="font-semibold">{l.name}</span>
                  </span>
                </td>
                <td className="max-w-[210px] px-4 py-3.5">
                  <LockedEmail value={l.emailMasked} />
                </td>
                <td className="px-4 py-3.5 text-foreground/80">{l.country}</td>
                <td className="px-4 py-3.5 font-semibold text-primary dark:text-[#9db8ff]">{l.company}</td>
                <td className="px-4 py-3.5 text-foreground/80">
                  {l.designation}
                  <Tags lead={l} />
                </td>
                <td className="px-4 py-3.5">
                  <UnlockButton name={l.name} onClick={() => onUnlock(l)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="divide-y divide-border md:hidden">
        {leads.map((l) => (
          <li key={l.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar initials={l.initials} tone={l.tone} className="size-10 text-[13px]" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{l.name}</p>
                <p className="text-[13px] text-foreground/80">{l.designation}</p>
                <p className="mt-0.5 text-[13px]">
                  <span className="font-semibold text-primary dark:text-[#9db8ff]">{l.company}</span>
                  <span className="text-muted"> · {l.country}</span>
                </p>
                <Tags lead={l} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="min-w-0 text-[13px]">
                <LockedEmail value={l.emailMasked} />
              </span>
              <UnlockButton name={l.name} onClick={() => onUnlock(l)} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function CompaniesTable({ companies }: { companies: DemoCompany[] }) {
  const intent = (c: DemoCompany) => (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${c.intent === "high" ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400" : "bg-foreground/[0.07] text-muted"}`}>
      {c.intent === "high" ? "High intent" : "Medium intent"}
    </span>
  );
  const match = (c: DemoCompany) => (
    <span className="inline-flex rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">{c.fit}% Match</span>
  );
  const tile = (c: DemoCompany) => (
    <span aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-white ${TONES[(c.name.length + c.fit) % TONES.length]}`}>
      {c.name[0]?.toUpperCase()}
    </span>
  );

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              {["Company", "Location", "Size", "Intent", "Fit", "Contacts"].map((h) => (
                <th key={h} className="px-4 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-foreground/[0.02]">
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-3">
                    {tile(c)}
                    <span>
                      <span className="flex items-center gap-2 font-semibold">
                        {c.name}
                        {c.target && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary dark:text-[#9db8ff]">Your target</span>}
                      </span>
                      <span className="block text-[12px] text-muted">{c.domain}</span>
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3.5 text-foreground/80">{c.location}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-foreground/80">{c.size} employees</td>
                <td className="px-4 py-3.5">{intent(c)}</td>
                <td className="px-4 py-3.5">{match(c)}</td>
                <td className="px-4 py-3.5 text-foreground/80">{c.contacts} contacts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {companies.map((c) => (
          <li key={c.id} className="p-4">
            <div className="flex items-start gap-3">
              {tile(c)}
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">
                  {c.name} {c.target && <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary dark:text-[#9db8ff]">Your target</span>}
                </p>
                <p className="text-[12px] text-muted">{c.domain}</p>
                <p className="mt-1 text-[13px] text-foreground/80">
                  {c.location} · {c.size} employees · {c.contacts} contacts
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {match(c)}
                  {intent(c)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* --------------------------------- the view --------------------------------- */

export function ResultsView({ result, onNewSearch }: { result: DemoSearchResult; onNewSearch: () => void }) {
  const [tab, setTab] = useState<"leads" | "companies">("leads");
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [unlocking, setUnlocking] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      result.leads.filter((l) => {
        if (filter === "decision" && !l.decisionMaker) return false;
        if (filter === "verified" && !l.verified) return false;
        if (filter === "intent" && l.intent !== "high") return false;
        return !q || `${l.name} ${l.company} ${l.designation}`.toLowerCase().includes(q);
      }),
    [result.leads, filter, q]
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const subject = result.query || result.industryLabel;

  const openUnlock = (l: DemoLead) => {
    trackDemoEvent("unlock_click", { lead: l.id });
    setUnlocking(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display font-extrabold tracking-tight text-foreground" style={{ margin: 0, fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Personalized Demo Results
          </h2>
          <p className="mt-2 text-[14px] text-muted">
            Sample prospects for <span className="font-semibold text-foreground/80">{subject}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onNewSearch}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-[13px] font-semibold transition-colors hover:border-primary"
          >
            <ArrowLeft className="size-4" aria-hidden /> New Search
          </button>
          <Link
            href="/contact?topic=demo"
            onClick={() => trackDemoEvent("book_demo_click", { from: "results" })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-colors hover:bg-primary-hover"
          >
            Book a Demo <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Result type" className="mt-6 inline-flex gap-1.5 rounded-xl border border-border bg-card p-1 dark:border-white/15">
        {(
          [
            ["leads", "Leads", result.leads.length, Users],
            ["companies", "Companies", result.companies.length, Building2],
          ] as const
        ).map(([id, label, count, Icon]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              if (id === "companies") trackDemoEvent("view_companies");
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              tab === id ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden /> {label}
            <span className={`rounded-md px-1.5 text-[11px] ${tab === id ? "bg-white/20" : "bg-foreground/10"}`}>{count}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-40px_rgba(37,99,235,0.35)] dark:border-white/15 dark:bg-white/[0.03] dark:shadow-none">
        {tab === "leads" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <div className="relative min-w-[200px] flex-1 sm:max-w-[320px]">
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <label htmlFor="lead-search" className="sr-only">
                  Search leads by name, company or designation
                </label>
                <input
                  id="lead-search"
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search leads by name, company, or designation…"
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-[13px] outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
              <div role="group" aria-label="Filter leads" className="flex flex-wrap gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={filter === f.id}
                    onClick={() => {
                      setFilter(f.id);
                      setPage(1);
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                      filter === f.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {visible.length > 0 ? (
              <LeadsTable leads={visible} onUnlock={openUnlock} />
            ) : (
              <div className="px-6 py-14 text-center">
                <p className="font-display text-[17px] font-bold">No leads match those filters</p>
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="mt-3 text-[13px] font-semibold text-primary hover:underline dark:text-[#9db8ff]"
                >
                  Clear filters
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3.5 text-[12.5px] text-muted">
              <span>
                {filtered.length === 0 ? "No sample leads" : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length} sample leads`}
              </span>
              {pages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={current <= 1}
                    onClick={() => setPage(current - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-semibold transition-colors hover:border-primary disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft className="size-3.5" aria-hidden /> Previous
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Page ${n}`}
                      aria-current={n === current ? "page" : undefined}
                      onClick={() => setPage(n)}
                      className={`size-8 rounded-lg text-[12.5px] font-semibold transition-colors ${n === current ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary"}`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={current >= pages}
                    onClick={() => setPage(current + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-semibold transition-colors hover:border-primary disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next <ChevronRight className="size-3.5" aria-hidden />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <CompaniesTable companies={result.companies} />
        )}
      </div>

      {/* Honest framing + the nudge */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5 sm:p-6">
        <div className="max-w-[560px]">
          <p className="text-[14px] font-semibold">This is sample data for demonstration.</p>
          <p className="mt-1 text-[13px] leading-[1.65] text-muted">
            The companies and people shown are illustrative, not real. Connect your data sources to see live, verified prospects for your market.
            {result.searchesLeft <= 3 && ` You have ${result.searchesLeft} demo ${result.searchesLeft === 1 ? "search" : "searches"} left.`}
          </p>
        </div>
        <Link
          href="/contact?topic=demo"
          onClick={() => trackDemoEvent("book_demo_click", { from: "footer-card" })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          See it with live data <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <UnlockDialog open={unlocking} onClose={() => setUnlocking(false)} />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, TriangleAlert } from "lucide-react";
import { Analyzing } from "./analyzing";
import { IndustrySelect } from "./industry-select";
import { ProductMock } from "./product-mock";
import { ResultsView } from "./results-view";
import { CONTAINER, h1Style } from "@/components/solutions/solution-ui";
import type { IndustryId } from "@/lib/demo/industries";
import type { DemoSearchResult } from "@/lib/demo/types";

type Step = "search" | "analyzing" | "results";

export function DemoExperience({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("search");
  const [industry, setIndustry] = useState<IndustryId | "">("");
  const [company, setCompany] = useState("");
  const [result, setResult] = useState<DemoSearchResult | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<{ text: string; limit: boolean } | null>(null);
  const [missing, setMissing] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  // Move focus and scroll to the top of each new step (also helps screen readers).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    stage.current?.focus({ preventScroll: true });
  }, [step]);

  async function explore(e: FormEvent) {
    e.preventDefault();
    if (!industry) {
      setMissing(true);
      document.getElementById("industry")?.focus();
      return;
    }
    setError(null);
    setMissing(false);
    setReady(false);
    setResult(null);
    setStep("analyzing");

    try {
      const res = await fetch("/api/demo/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, company }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setResult(data.result);
        setReady(true); // the analyzing screen finishes its bar, then calls onDone
        return;
      }
      if (data.code === "session") {
        router.push("/get-a-demo?expired=1");
        return;
      }
      setError({ text: data.error ?? "Something went wrong. Please try again.", limit: data.code === "limit" });
    } catch {
      setError({ text: "We couldn't reach the server. Check your connection and try again.", limit: false });
    }
    setStep("search");
  }

  const onAnalyzed = useCallback(() => setStep("results"), []);

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] via-background to-background dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-40 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-[#3a3690]/30 blur-[140px]" />
        </div>
      </div>

      <div ref={stage} tabIndex={-1} className={`${CONTAINER} min-h-[72vh] py-12 outline-none sm:py-16`}>
        {step === "search" && (
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-primary dark:text-[#9db8ff]">
              <Star className="size-3.5" aria-hidden /> No login required
            </span>
            <h1 className="mt-5 font-display font-extrabold text-foreground" style={h1Style}>
              Experience AQSTRA in Action
            </h1>
            <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.75] text-muted sm:text-[17px]">
              Discover relevant companies, find decision-makers, and explore sales opportunities tailored to your business.
            </p>
            <p className="mt-3 text-[13px] text-muted">Welcome, {firstName}. Choose an industry to begin.</p>

            {error && (
              <div role="alert" className="mx-auto mt-6 flex max-w-[560px] items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-[13.5px] leading-[1.6] text-red-700 dark:text-red-300">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {error.text}{" "}
                  {error.limit && (
                    <Link href="/contact?topic=demo" className="font-semibold underline">
                      Book a call
                    </Link>
                  )}
                </span>
              </div>
            )}

            <form
              onSubmit={explore}
              noValidate
              className="mt-8 rounded-2xl border border-border bg-card p-5 text-left shadow-[0_30px_70px_-36px_rgba(37,99,235,0.45)] dark:border-white/15 dark:bg-white/[0.04] dark:shadow-none sm:p-6"
            >
              <div className="grid items-end gap-4 sm:grid-cols-[1.15fr_1fr_auto]">
                <div>
                  <label htmlFor="industry" className="mb-1.5 block text-[12.5px] font-semibold">
                    Industry
                  </label>
                  <IndustrySelect
                    value={industry}
                    invalid={missing && !industry}
                    onChange={(v) => {
                      setIndustry(v);
                      setMissing(false);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 flex items-baseline justify-between text-[12.5px] font-semibold">
                    Target Company
                    <span className="text-[11px] font-normal text-muted">Optional</span>
                  </label>
                  <input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    maxLength={60}
                    autoComplete="off"
                    placeholder="e.g., Acme Technologies"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-[14px] outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 text-[14px] font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(37,99,235,.65)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover sm:w-auto"
                >
                  Explore Demo <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
              {missing && !industry && (
                <p role="alert" className="mt-2 text-[12.5px] text-red-600 dark:text-red-400">
                  Please choose an industry to continue.
                </p>
              )}
              <p className="mt-4 text-[12px] leading-[1.6] text-muted">
                Results use sample data for demonstration. Connect your data sources for live results.
              </p>
            </form>

            <ProductMock variant="full" className="mx-auto mt-10 max-w-[680px] text-left" />
          </div>
        )}

        {step === "analyzing" && <Analyzing industryId={industry} ready={ready} onDone={onAnalyzed} />}

        {step === "results" && result && (
          <ResultsView
            result={result}
            onNewSearch={() => {
              setStep("search");
            }}
          />
        )}
      </div>
    </section>
  );
}

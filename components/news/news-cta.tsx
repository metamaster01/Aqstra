import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEMO_URL, SIGNUP_URL } from "@/lib/news/config";
import { Reveal } from "./reveal";

export function NewsCta() {
  return (
    <section className="py-16">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-card/70 px-6 py-14 text-center sm:px-12">
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-transparent to-[#9db06a]/15" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-[-0.02em] sm:text-4xl">Don't just read the news. Find the companies it affects.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-muted">Pick any signal above and Aqstra finds the suppliers, buyers and decision-makers behind it.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={SIGNUP_URL} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover">Start Discovering <ArrowRight className="size-4" /></Link>
            <Link href={DEMO_URL} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary dark:border-foreground/70 dark:bg-transparent">Book a Free Demo <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

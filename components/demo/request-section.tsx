import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { CONTAINER, h1Style } from "@/components/solutions/solution-ui";
import { FadeIn } from "@/components/solutions/fade-in";
import { ProductMock } from "./product-mock";
import { RequestForm } from "./request-form";

const POINTS = [
  "Identify prospects aligned with your ideal customer profile",
  "Research companies with AI-assisted business context",
  "Find relevant decision-makers and key contacts",
  "Build and prioritize actionable sales opportunities",
];

export function RequestSection({ welcomeBack, expired }: { welcomeBack?: string; expired?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] to-background dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-32 left-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#3a3690]/35 blur-[130px]" />
        </div>
      </div>

      <div className={`${CONTAINER} grid items-start gap-10 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:pt-20`}>
        {/* Copy (and the product preview on desktop) */}
        <FadeIn className="lg:pt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11.5px] font-semibold text-primary dark:text-[#9db8ff]">
            <Sparkles className="size-3.5" aria-hidden /> AI-Powered Prospecting
          </span>

          <h1 className="mt-5 font-display font-extrabold text-foreground" style={h1Style}>
            See AQSTRA in Action
          </h1>
          <p className="mt-5 max-w-[500px] text-[15px] leading-[1.75] text-muted sm:text-[17px]">
            Discover how AQSTRA helps you identify potential customers, research companies, find relevant decision-makers,
            and build actionable sales opportunities.
          </p>

          {welcomeBack && (
            <Link
              href="/demo"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-[13.5px] font-semibold text-primary transition-colors hover:bg-primary/15 dark:text-[#9db8ff]"
            >
              Welcome back, {welcomeBack}. Continue your demo <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
          {expired && (
            <p role="status" className="mt-6 max-w-[500px] rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-[13.5px] text-amber-900 dark:text-amber-200">
              That demo link has expired. Request a new one below and we&apos;ll set you up again.
            </p>
          )}

          <ul className="mt-7 space-y-3.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[14.5px] leading-[1.5]">
                <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <p className="mt-7 flex items-center gap-2 text-[12.5px] text-muted">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
            Your information is handled in line with our{" "}
            <Link href="/privacy-policy" className="font-semibold text-foreground/80 underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <ProductMock className="mt-10 hidden max-w-[470px] lg:block" />
        </FadeIn>

        {/* Form */}
        <FadeIn delay={0.1} className="mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end">
          <RequestForm />
        </FadeIn>

        {/* Product preview on phones and tablets: after the form, not before it */}
        <FadeIn delay={0.15} className="mx-auto w-full max-w-[520px] lg:hidden">
          <ProductMock />
        </FadeIn>
      </div>
    </section>
  );
}

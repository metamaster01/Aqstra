import { Lightbulb, Radar, Search } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  { icon: Radar, title: "Spot the signal", body: "Trade moves, new policies, funding, expansions. We pick the ones that create business opportunities." },
  { icon: Lightbulb, title: "See why it matters", body: "A short plain-language note on who is affected and what changes for them." },
  { icon: Search, title: "Search it on Aqstra", body: "One click opens Aqstra with the right search filled in, so you go from news to prospects in seconds." },
];

export function HowItWorks() {
  return (
    <section aria-label="How to use this page" className="py-14">
      <ol className="grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <li className="relative h-full rounded-2xl border border-border bg-card/60 p-6">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-foreground/[0.06]">{i + 1}</span>
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><s.icon className="size-5" aria-hidden /></span>
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">{s.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

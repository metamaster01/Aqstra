import { Info, TriangleAlert, Lightbulb } from "lucide-react";
import type { CalloutContent, CodeContent, ListContent } from "../../../lib/content";

const CALLOUT_STYLE: Record<CalloutContent["variant"], { icon: typeof Info; cls: string }> = {
  info: { icon: Info, cls: "border-primary/30 bg-primary/5 text-primary dark:bg-primary/10" },
  warning: { icon: TriangleAlert, cls: "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-400" },
  tip: { icon: Lightbulb, cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-400" },
};

export function CalloutBlock({ variant, body }: CalloutContent) {
  const { icon: Icon, cls } = CALLOUT_STYLE[variant];
  return (
    <div className={`mt-2 flex gap-3 rounded-xl border px-4 py-3.5 text-[14px] leading-relaxed ${cls}`}>
      <Icon className="mt-0.5 size-[18px] shrink-0" />
      <p className="text-foreground/90">{body}</p>
    </div>
  );
}

export function CodeBlock({ language, code }: CodeContent) {
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-border bg-[#0a0e1a]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-white/50">
        {language}
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed text-white/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ListBlock({ items }: ListContent) {
  return (
    <ul className="mt-2 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/90">
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

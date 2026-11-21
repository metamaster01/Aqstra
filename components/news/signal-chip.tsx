import { signalMeta } from "./signals";

export function SignalChip({ slug, className = "" }: { slug: string; className?: string }) {
  const m = signalMeta(slug);
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${m.chip} ${className}`}>
      <Icon className="size-3.5" aria-hidden />
      {m.label}
    </span>
  );
}

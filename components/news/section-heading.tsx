import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, blurb, aside, id }: { eyebrow: string; title: string; blurb?: string; aside?: ReactNode; id?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-[#9db6ff]">{eyebrow}</p>
        <h2 id={id} className="font-display text-3xl font-extrabold leading-tight tracking-[-0.02em] sm:text-4xl">{title}</h2>
        {blurb && <p className="mt-3 text-[15px] leading-7 text-muted">{blurb}</p>}
      </div>
      {aside}
    </div>
  );
}

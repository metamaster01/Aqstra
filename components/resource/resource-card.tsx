import Image from "next/image";
import Link from "next/link";
import { BookOpen, FileText, PenLine, Play, type LucideIcon } from "lucide-react";
import type { Accent, Resource, ResourceType } from "../../lib/resources";

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

const TYPE_ICON: Record<ResourceType, LucideIcon> = {
  Article: FileText,
  Guide: BookOpen,
  Video: Play,
  Blog: PenLine,
};

// Full class strings so Tailwind can see them.
const ACCENT_GRADIENT: Record<Accent, string> = {
  navy: "from-[#0b1730] via-[#1c3b6b] to-[#b7d36f]",
  violet: "from-[#1d1a4d] via-[#3a3690] to-[#8ea0e0]",
  teal: "from-[#0b2a33] via-[#14566a] to-[#9fd8bf]",
  slate: "from-[#111827] via-[#334155] to-[#a5b4c8]",
};

const CARD_BASE =
  "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card " +
  "shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 " +
  "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] " +
  "dark:shadow-none dark:hover:border-white/25 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const href = (r: Resource) => `/resource/${r.slug}`;

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-md bg-primary/10 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-primary dark:bg-primary/20 dark:text-[#cfd3ea]">
      {children}
    </span>
  );
}

function Meta({ readTime, category }: { readTime: string; category: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
      <span>{readTime}</span>
      <span aria-hidden className="size-1 rounded-full bg-muted/40" />
      <span>{category}</span>
    </p>
  );
}

/** Gradient cover with the glass icon tile, used when there's no image. */
function CoverArt({
  accent,
  type,
  className = "",
}: {
  accent: Accent;
  type: ResourceType;
  className?: string;
}) {
  const Icon = TYPE_ICON[type];
  return (
    <div
      aria-hidden
      className={`relative isolate overflow-hidden bg-gradient-to-br ${ACCENT_GRADIENT[accent]} ${className}`}
    >
      <span className="absolute -right-10 -top-12 size-44 rounded-full border border-white/15" />
      <span className="absolute -bottom-12 -left-8 size-36 rounded-full border border-white/10" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-12 place-items-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <Icon className="size-5" />
        </span>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Large featured card (uses /public/resources/resource-1.png)               */
/* -------------------------------------------------------------------------- */

export function FeaturedCard({ resource: r }: { resource: Resource }) {
  return (
    <Link href={href(r)} className={`${CARD_BASE} h-full`}>
      {r.cover ? (
        <div className="relative aspect-[12/5] w-full overflow-hidden">
          <Image
            src={r.cover}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <CoverArt accent={r.accent} type={r.type} className="aspect-[12/5] w-full" />
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <Badge>{r.tag}</Badge>
        <h3 className="mt-4 font-display text-[22px] font-bold leading-[1.2] tracking-[-0.02em] sm:text-[26px]">
          {r.title}
        </h3>
        <p className="mt-3 max-w-[560px] text-[15px] leading-[1.7] text-muted">{r.description}</p>
        <div className="mt-auto pt-6">
          <Meta readTime={r.readTime} category={r.category} />
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Compact text card (right column next to the featured card)                */
/* -------------------------------------------------------------------------- */

export function SideCard({ resource: r }: { resource: Resource }) {
  return (
    <Link href={href(r)} className={`${CARD_BASE} h-full p-6`}>
      <Badge>{r.tag}</Badge>
      <h3 className="mt-4 font-display text-[17px] font-bold leading-[1.3] tracking-[-0.015em] sm:text-[18px]">
        {r.title}
      </h3>
      <p className="mt-2 text-sm leading-[1.65] text-muted">{r.description}</p>
      <div className="mt-auto pt-5">
        <Meta readTime={r.readTime} category={r.category} />
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grid card (latest resources / search results)                             */
/* -------------------------------------------------------------------------- */

export function GridCard({ resource: r }: { resource: Resource }) {
  return (
    <Link href={href(r)} className={`${CARD_BASE} h-full`}>
      {r.cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={r.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <CoverArt accent={r.accent} type={r.type} className="aspect-[16/9] w-full" />
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge>{r.tag}</Badge>
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
            {r.type}
          </span>
        </div>
        <h3 className="mt-3.5 font-display text-[17px] font-bold leading-[1.3] tracking-[-0.015em]">
          {r.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.65] text-muted">{r.description}</p>
        <div className="mt-auto pt-5">
          <Meta readTime={r.readTime} category={r.category} />
        </div>
      </div>
    </Link>
  );
}

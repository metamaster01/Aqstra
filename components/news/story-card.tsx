// "use client";

// import { ExternalLink } from "lucide-react";
// import { sourceHost } from "@/lib/news/format";
// import type { Story } from "@/lib/news/types";
// import { useNews } from "./news-provider";
// import { RelativeTime } from "./relative-time";
// import { ScoreRing } from "./score-ring";
// import { SearchChips } from "./search-chips";
// import { SignalChip } from "./signal-chip";
// import { signalMeta } from "./signals";
// import { Spotlight } from "./spotlight";

// export type CardVariant = "hero" | "standard" | "compact";

// /**
//  * One news card. The headline is a real button stretched over the whole card, so the card is
//  * clickable with a mouse AND reachable by keyboard; chips and links sit above it.
//  */
// export function StoryCard({ story, variant = "standard", className = "" }: { story: Story; variant?: CardVariant; className?: string }) {
//   const { openStory } = useNews();
//   const meta = signalMeta(story.signal_type);
//   const hero = variant === "hero";
//   const compact = variant === "compact";
//   const searches = story.suggested_searches.slice(0, hero ? 3 : compact ? 0 : 2);
//   const host = sourceHost(story.source_url);

//   return (
//     <Spotlight className={`h-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_24px_50px_-28px_rgba(37,99,235,.55)] ${className}`}>
//       {hero && <div aria-hidden className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br ${meta.glow} via-transparent to-transparent`} />}
//       <article className={`relative flex h-full flex-col ${hero ? "gap-5 p-6 sm:p-8" : compact ? "gap-3 p-4" : "gap-4 p-5"}`}>
//         <header className="flex items-start justify-between gap-3">
//           <div className="flex flex-wrap items-center gap-2">
//             <SignalChip slug={story.signal_type} />
//             <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
//               {story.scope === "india" ? "India" : "Global"}
//             </span>
//           </div>
//           {!compact && <ScoreRing score={story.score} size={hero ? 48 : 40} />}
//         </header>

//         <h3 className={`font-display font-bold leading-snug tracking-tight ${hero ? "text-2xl sm:text-[32px] sm:leading-[1.15]" : compact ? "text-base" : "text-[19px]"}`}>
//           <button
//             type="button"
//             onClick={() => openStory(story)}
//             className="text-left after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
//           >
//             {story.headline}
//           </button>
//         </h3>

//         {!compact && <p className={`text-muted ${hero ? "line-clamp-4 text-base leading-7" : "line-clamp-3 text-sm leading-6"}`}>{story.summary}</p>}

//         {!compact && story.why_it_matters && (
//           <div className="rounded-xl border-l-2 border-primary bg-primary/[0.05] px-3.5 py-2.5">
//             <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary dark:text-[#9db6ff]">Why it matters</p>
//             <p className={`leading-6 ${hero ? "text-[15px]" : "line-clamp-3 text-sm"}`}>{story.why_it_matters}</p>
//           </div>
//         )}

//         <SearchChips searches={searches} className={hero ? "mt-auto" : ""} />

//         <footer className={`relative z-10 ${hero ? "" : "mt-auto"} flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted`}>
//           <a
//             href={story.source_url}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//             className="inline-flex items-center gap-1 font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
//             title={host}
//           >
//             {story.source_name} <ExternalLink className="size-3" aria-hidden />
//           </a>
//           <span aria-hidden>·</span>
//           <RelativeTime iso={story.published_at} />
//           {story.also_covered_by.length > 0 && (
//             <>
//               <span aria-hidden>·</span>
//               <span>+{story.also_covered_by.length} {story.also_covered_by.length === 1 ? "outlet" : "outlets"}</span>
//             </>
//           )}
//         </footer>
//       </article>
//     </Spotlight>
//   );
// }



"use client";

import { ExternalLink } from "lucide-react";
import { sourceHost } from "@/lib/news/format";
import type { Story } from "@/lib/news/types";
import { useNews } from "./news-provider";
import { RelativeTime } from "./relative-time";
import { ScoreRing } from "./score-ring";
import { SearchChips } from "./search-chips";
import { SignalChip } from "./signal-chip";
import { signalMeta } from "./signals";
import { Spotlight } from "./spotlight";

/**
 * hero     the big lead card (summary + why it matters + searches)
 * standard a normal grid card
 * side     short card next to the hero: headline, searches and source only
 * compact  tiny list card (India vs Global)
 */
export type CardVariant = "hero" | "standard" | "side" | "compact";

/**
 * One news card. The headline is a real button stretched over the whole card, so the card is
 * clickable with a mouse AND reachable by keyboard; chips and links sit above it.
 */
export function StoryCard({ story, variant = "standard", className = "" }: { story: Story; variant?: CardVariant; className?: string }) {
  const { openStory } = useNews();
  const meta = signalMeta(story.signal_type);
  const hero = variant === "hero";
  const compact = variant === "compact";
  const side = variant === "side";
  const short = compact || side;
  const searches = story.suggested_searches.slice(0, hero ? 3 : compact ? 0 : 2);
  const host = sourceHost(story.source_url);

  return (
    <Spotlight className={`h-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_24px_50px_-28px_rgba(37,99,235,.55)] ${className}`}>
      {hero && <div aria-hidden className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br ${meta.glow} via-transparent to-transparent`} />}
      <article className={`relative flex h-full flex-col ${hero ? "gap-5 p-6 sm:p-8" : compact ? "gap-3 p-4" : side ? "gap-3 p-5" : "gap-4 p-5"}`}>
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SignalChip slug={story.signal_type} />
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {story.scope === "india" ? "India" : "Global"}
            </span>
          </div>
          {!compact && <ScoreRing score={story.score} size={hero ? 48 : 40} />}
        </header>

        <h3 className={`font-display font-bold leading-snug tracking-tight ${hero ? "text-2xl sm:text-[32px] sm:leading-[1.15]" : compact ? "text-base" : "text-[19px]"}`}>
          <button
            type="button"
            onClick={() => openStory(story)}
            className="text-left after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
          >
            {story.headline}
          </button>
        </h3>

        {!short && <p className={`text-muted ${hero ? "line-clamp-4 text-base leading-7" : "line-clamp-3 text-sm leading-6"}`}>{story.summary}</p>}

        {!short && story.why_it_matters && (
          <div className="rounded-xl border-l-2 border-primary bg-primary/[0.05] px-3.5 py-2.5">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary dark:text-[#9db6ff]">Why it matters</p>
            <p className={`leading-6 ${hero ? "text-[15px]" : "line-clamp-3 text-sm"}`}>{story.why_it_matters}</p>
          </div>
        )}

        <SearchChips searches={searches} className={hero ? "mt-auto" : ""} />

        <footer className={`relative z-10 ${hero ? "" : "mt-auto"} flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted`}>
          <a
            href={story.source_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
            title={host}
          >
            {story.source_name} <ExternalLink className="size-3" aria-hidden />
          </a>
          <span aria-hidden>·</span>
          <RelativeTime iso={story.published_at} />
          {story.also_covered_by.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>+{story.also_covered_by.length} {story.also_covered_by.length === 1 ? "outlet" : "outlets"}</span>
            </>
          )}
        </footer>
      </article>
    </Spotlight>
  );
}
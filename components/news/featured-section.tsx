// import { FEATURED_HOURS } from "@/lib/news/config";
// import type { Story } from "@/lib/news/types";
// import { EmptyState } from "./states";
// import { Reveal } from "./reveal";
// import { SectionHeading } from "./section-heading";
// import { StoryCard, type CardVariant } from "./story-card";

// /** Bento layout: one big lead story, then smaller ones that fill the grid whatever the count. */
// function layout(i: number, n: number): { variant: CardVariant; cls: string } {
//   if (n === 1) return { variant: "hero", cls: "lg:col-span-6" };
//   if (n === 2) return i === 0 ? { variant: "hero", cls: "lg:col-span-4" } : { variant: "standard", cls: "lg:col-span-2" };
//   if (i === 0) return { variant: "hero", cls: "lg:col-span-4 lg:row-span-2" };
//   if (i <= 2) return { variant: "standard", cls: "lg:col-span-2" };
//   return { variant: "standard", cls: n === 4 ? "lg:col-span-6" : "lg:col-span-3" };
// }

// export function FeaturedSection({ stories, unavailable }: { stories: Story[]; unavailable: boolean }) {
//   const stale = stories.length > 0 && stories.every((s) => Date.now() - Date.parse(s.published_at) > FEATURED_HOURS * 3_600_000);
//   return (
//     <section id="featured" aria-labelledby="featured-title" className="scroll-mt-24 py-16">
//       <SectionHeading
//         id="featured-title"
//         eyebrow={`Featured · last ${FEATURED_HOURS} hours`}
//         title="The signals worth acting on"
//         blurb={stale ? "No new top stories right now, so these are the latest ones. This section updates the moment something bigger breaks." : "The highest-impact stories of the past two days, each with the searches to run next."}
//       />
//       {stories.length === 0 ? (
//         <EmptyState
//           title={unavailable ? "News is taking a moment" : "Featured stories land here"}
//           body={unavailable ? "We couldn't reach the news feed just now. Please refresh in a minute." : "As soon as a high-impact story breaks, it appears here."}
//         />
//       ) : (
//         <div className="grid gap-5 lg:grid-cols-6">
//           {stories.map((s, i) => {
//             const l = layout(i, stories.length);
//             return (
//               <Reveal key={s.id} delay={i * 0.07} className={`${l.cls} min-w-0`}>
//                 <StoryCard story={s} variant={l.variant} />
//               </Reveal>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { FEATURED_HOURS, FEATURED_ROTATE_MS } from "@/lib/news/config";
import type { Story } from "@/lib/news/types";
import { useNews } from "./news-provider";
import { EmptyState } from "./states";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { StoryCard, type CardVariant } from "./story-card";

const VISIBLE = 3; // one big card + two small ones

/** Static bento for 1 to 3 stories. */
function staticLayout(i: number, n: number): { variant: CardVariant; cls: string } {
  if (n === 1) return { variant: "hero", cls: "lg:col-span-6" };
  if (n === 2) return i === 0 ? { variant: "hero", cls: "lg:col-span-4" } : { variant: "side", cls: "lg:col-span-2" };
  return i === 0 ? { variant: "hero", cls: "lg:col-span-4 lg:row-span-2" } : { variant: "side", cls: "lg:col-span-2" };
}

/**
 * With more than three featured stories, three are shown at a time and the big slot moves on slowly
 * (every FEATURED_ROTATE_MS). It stops while the reader hovers, focuses a card, has the story sheet
 * open, switched tabs, pressed pause, or prefers reduced motion.
 */
export function FeaturedSection({ stories, unavailable, stale }: { stories: Story[]; unavailable: boolean; stale: boolean }) {
  const { drawerOpen } = useNews();
  const reduce = useReducedMotion();
  const n = stories.length;
  const rotating = n > VISIBLE;

  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [engaged, setEngaged] = useState(false); // hover or keyboard focus inside the cards
  const [hidden, setHidden] = useState(false); // browser tab not visible

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  const running = rotating && !userPaused && !engaged && !hidden && !drawerOpen && !reduce;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), FEATURED_ROTATE_MS);
    return () => clearTimeout(t);
  }, [running, active, n]);

  const go = (d: number) => setActive((a) => (a + d + n) % n);
  const shown = rotating ? Array.from({ length: VISIBLE }, (_, k) => stories[(active + k) % n]) : stories;

  return (
    <section id="featured" aria-labelledby="featured-title" className="scroll-mt-24 py-16">
      <SectionHeading
        id="featured-title"
        eyebrow={`Featured · last ${FEATURED_HOURS} hours`}
        title="The signals worth acting on"
        blurb={stale ? "No new top stories right now, so these are the latest ones. This section updates the moment something bigger breaks." : "The highest-impact stories of the past two days, each with the searches to run next."}
      />
      {n === 0 ? (
        <EmptyState
          title={unavailable ? "News is taking a moment" : "Featured stories land here"}
          body={unavailable ? "We couldn't reach the news feed just now. Please refresh in a minute." : "As soon as a high-impact story breaks, it appears here."}
        />
      ) : (
        <>
          <div
            className="grid gap-5 lg:grid-cols-6"
            onMouseEnter={() => setEngaged(true)}
            onMouseLeave={() => setEngaged(false)}
            onFocus={() => setEngaged(true)}
            onBlur={() => setEngaged(false)}
            aria-live={running ? "off" : "polite"}
          >
            {rotating ? (
              <AnimatePresence initial={false} mode="popLayout">
                {shown.map((s, i) => {
                  const l = staticLayout(i, VISIBLE);
                  return (
                    <motion.div
                      key={s.id}
                      layout="position"
                      data-featured-slot={i === 0 ? "hero" : "side"}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={`${l.cls} min-w-0`}
                      style={{ order: i }}
                    >
                      <StoryCard story={s} variant={l.variant} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              shown.map((s, i) => {
                const l = staticLayout(i, n);
                return (
                  <Reveal key={s.id} delay={i * 0.07} className={`${l.cls} min-w-0`}>
                    <StoryCard story={s} variant={l.variant} />
                  </Reveal>
                );
              })
            )}
          </div>

          {rotating && (
            <div className="mt-6 flex items-center gap-4" role="group" aria-label="Featured stories carousel controls">
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => go(-1)} aria-label="Previous featured story" className="grid size-9 place-items-center rounded-full border border-border bg-card/80 text-foreground transition-colors hover:border-primary/50 hover:text-primary">
                  <ChevronLeft className="size-4" aria-hidden />
                </button>
                <button type="button" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? "Resume automatic rotation" : "Pause automatic rotation"} aria-pressed={userPaused} className="grid size-9 place-items-center rounded-full border border-border bg-card/80 text-foreground transition-colors hover:border-primary/50 hover:text-primary">
                  {userPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next featured story" className="grid size-9 place-items-center rounded-full border border-border bg-card/80 text-foreground transition-colors hover:border-primary/50 hover:text-primary">
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              </div>

              <ol className="flex min-w-0 flex-1 items-center gap-1.5" aria-label="Choose the lead story">
                {stories.map((s, i) => (
                  <li key={s.id} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                    <button type="button" onClick={() => setActive(i)} aria-label={`Show story ${i + 1} of ${n} as lead`} aria-current={i === active} className="absolute -inset-y-2 inset-x-0 z-10" />
                    {i < active || (i === active && !running && !(rotating && reduce)) ? (
                      <span className={`absolute inset-0 rounded-full ${i === active ? "bg-primary" : "bg-primary/35"}`} />
                    ) : null}
                    {i === active && running && (
                      <motion.span
                        key={`${active}-${running}`}
                        className="absolute inset-0 origin-left rounded-full bg-primary"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: FEATURED_ROTATE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </li>
                ))}
              </ol>

              <p className="shrink-0 text-xs tabular-nums text-muted" aria-hidden>{active + 1} / {n}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
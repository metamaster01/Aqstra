// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { ArrowRight, Search, CircleDot, Filter, CheckCircle2, Users, Send, type LucideIcon } from "lucide-react";
// import {
//   CampaignToolsMockup,
//   LeadDiscoveryMockup,
//   LeadIntelligenceMockup,
//   LeadQualityMockup,
//   PrecisionClassificationMockup,
//   SmartFilteringMockup,
// } from "./feature-mockups";

// interface Feature {
//   id: string;
//   icon: LucideIcon;
//   tag: string;
//   title: string;
//   description: string;
//   mockup: () => React.ReactNode;
// }

// const FEATURES: Feature[] = [
//   {
//     id: "discovery",
//     icon: Search,
//     tag: "DISCOVERY ENGINE",
//     title: "Lead Discovery",
//     description: "Find prospects that fit your target. Discover companies and contacts based on the criteria that matter to your business.",
//     mockup: () => <LeadDiscoveryMockup />,
//   },
//   {
//     id: "classification",
//     icon: CircleDot,
//     tag: "CLASSIFICATION LAYER",
//     title: "Precision Classification",
//     description: "Know which prospects belong on your list. Classify prospects based on relevant business criteria and signals.",
//     mockup: () => <PrecisionClassificationMockup />,
//   },
//   {
//     id: "filtering",
//     icon: Filter,
//     tag: "FILTER PIPELINE",
//     title: "Smart Filtering",
//     description: "Cut through the noise. Filter out irrelevant contacts and focus on more relevant prospects.",
//     mockup: () => <SmartFilteringMockup />,
//   },
//   {
//     id: "quality",
//     icon: CheckCircle2,
//     tag: "QUALITY SCORING",
//     title: "Lead Quality",
//     description: "Build cleaner, more useful lists. Focus on qualified prospects instead of sorting through large unfiltered datasets.",
//     mockup: () => <LeadQualityMockup />,
//   },
//   {
//     id: "intelligence",
//     icon: Users,
//     tag: "ENRICHMENT LAYER",
//     title: "Lead Intelligence",
//     description: "Understand your prospects better. Bring relevant company and contact information together for better prospecting decisions.",
//     mockup: () => <LeadIntelligenceMockup />,
//   },
//   {
//     id: "campaigns",
//     icon: Send,
//     tag: "OUTREACH ENGINE",
//     title: "Campaign Tools",
//     description: "Turn qualified leads into action. Use your refined shortlist as the foundation for structured outreach campaigns.",
//     mockup: () => <CampaignToolsMockup />,
//   },
// ];

// const CYCLE_MS = 3200;

// export function FeaturesInteractive() {
//   const [active, setActive] = useState(0);
//   const [cycleKey, setCycleKey] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const goTo = useCallback((index: number) => {
//     setActive(index);
//     setCycleKey((k) => k + 1);
//   }, []);

//   useEffect(() => {
//     if (paused) return;
//     timeoutRef.current = setTimeout(() => {
//       setActive((i) => (i + 1) % FEATURES.length);
//       setCycleKey((k) => k + 1);
//     }, CYCLE_MS);
//     return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
//   }, [active, cycleKey, paused]);

//   const feature = FEATURES[active];

//   return (
//     <section className="bg-background py-20 sm:py-28">
//       <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-20">
//         <div className="mx-auto max-w-[560px] text-center">
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
//           >
//             Platform Capabilities
//           </motion.p>
//           <motion.h2
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.08 }}
//             className="mt-3 font-display text-[28px] font-bold leading-[1.25] tracking-[-0.02em] sm:text-[36px]"
//           >
//             Everything you need to build a better lead list.
//           </motion.h2>
//         </div>

//         <div
//           onMouseEnter={() => setPaused(true)}
//           onMouseLeave={() => setPaused(false)}
//           className="relative mt-16 grid grid-cols-1 items-stretch gap-10 rounded-[28px] border border-border bg-foreground/[0.015] p-5 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:p-12"
//         >
//           {/* dot-grid backdrop */}
//           <div
//             aria-hidden
//             className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.35] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px] text-foreground/20"
//           />

//           {/* LEFT: layered preview */}
//           <div className="relative z-10 flex justify-center py-6 lg:min-h-[500px] lg:py-0">
//             {/* static back card for depth, like the reference shot */}
//             <div
//               aria-hidden
//               className="absolute left-1/2 top-1/2 h-[82%] w-[88%] -translate-x-[54%] -translate-y-[46%] rotate-[-4deg] rounded-2xl border border-border/60 bg-card/60"
//             />
//             <div className="relative h-[420px] w-full max-w-[480px] lg:h-[430px]">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={feature.id}
//                   initial={{ opacity: 0, y: 18, rotate: 2, scale: 0.97 }}
//                   animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -14, scale: 0.97 }}
//                   transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//                   className="h-full"
//                 >
//                   {feature.mockup()}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* RIGHT: description + clickable list */}
//           <div className="relative z-10 flex flex-col justify-center lg:min-h-[500px]">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={feature.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.3 }}
//                 className="mb-7"
//               >
//                 <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
//                   {feature.tag}
//                 </span>
//                 <h3 className="mt-3 font-display text-[22px] font-bold tracking-[-0.01em]">{feature.title}</h3>
//                 <p className="mt-2 max-w-[440px] text-[13.5px] leading-[1.7] text-muted">{feature.description}</p>
//               </motion.div>
//             </AnimatePresence>

//             <div className="grid grid-cols-2 gap-2.5">
//               {FEATURES.map((f, i) => {
//                 const isActive = i === active;
//                 return (
//                   <button
//                     key={f.id}
//                     type="button"
//                     aria-current={isActive}
//                     onClick={() => goTo(i)}
//                     className="relative block overflow-hidden rounded-xl text-left"
//                   >
//                     {isActive && (
//                       <motion.span
//                         layoutId="feature-active-bg"
//                         className="absolute inset-0 rounded-xl border border-primary/25 bg-primary/[0.06]"
//                         transition={{ type: "spring", stiffness: 380, damping: 32 }}
//                       />
//                     )}
//                     <span className="relative flex items-center gap-2.5 px-3.5 py-3">
//                       <f.icon className={`size-4 shrink-0 ${isActive ? "text-primary" : "text-muted"}`} strokeWidth={2.25} />
//                       <span className={`flex-1 truncate text-[13px] font-semibold ${isActive ? "text-primary" : "text-foreground/85"}`}>
//                         {f.title}
//                       </span>
//                       <ArrowRight
//                         className={`size-3.5 shrink-0 transition-transform duration-300 ${isActive ? "translate-x-0 text-primary" : "-translate-x-1 text-muted/60"}`}
//                       />
//                     </span>
//                     {isActive && (
//                       <span className="relative mx-3.5 mb-3 block h-[2px] overflow-hidden rounded-full bg-primary/15">
//                         <motion.span
//                           key={cycleKey}
//                           initial={{ scaleX: 0 }}
//                           animate={{ scaleX: 1 }}
//                           transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
//                           style={{ transformOrigin: "left" }}
//                           className="block h-full bg-primary"
//                         />
//                       </span>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }






"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, CircleDot, Filter, CheckCircle2, Users, Send, type LucideIcon } from "lucide-react";
import {
  CampaignToolsMockup,
  LeadDiscoveryMockup,
  LeadIntelligenceMockup,
  LeadQualityMockup,
  PrecisionClassificationMockup,
  SmartFilteringMockup,
} from "./feature-mockups";

interface Feature {
  id: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
  mockup: () => React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: "discovery",
    icon: Search,
    tag: "DISCOVERY ENGINE",
    title: "Lead Discovery",
    description: "Find prospects that fit your target. Discover companies and contacts based on the criteria that matter to your business.",
    mockup: () => <LeadDiscoveryMockup />,
  },
  {
    id: "classification",
    icon: CircleDot,
    tag: "CLASSIFICATION LAYER",
    title: "Precision Classification",
    description: "Know which prospects belong on your list. Classify prospects based on relevant business criteria and signals.",
    mockup: () => <PrecisionClassificationMockup />,
  },
  {
    id: "filtering",
    icon: Filter,
    tag: "FILTER PIPELINE",
    title: "Smart Filtering",
    description: "Cut through the noise. Filter out irrelevant contacts and focus on more relevant prospects.",
    mockup: () => <SmartFilteringMockup />,
  },
  {
    id: "quality",
    icon: CheckCircle2,
    tag: "QUALITY SCORING",
    title: "Lead Quality",
    description: "Build cleaner, more useful lists. Focus on qualified prospects instead of sorting through large unfiltered datasets.",
    mockup: () => <LeadQualityMockup />,
  },
  {
    id: "intelligence",
    icon: Users,
    tag: "ENRICHMENT LAYER",
    title: "Lead Intelligence",
    description: "Understand your prospects better. Bring relevant company and contact information together for better prospecting decisions.",
    mockup: () => <LeadIntelligenceMockup />,
  },
  {
    id: "campaigns",
    icon: Send,
    tag: "OUTREACH ENGINE",
    title: "Campaign Tools",
    description: "Turn qualified leads into action. Use your refined shortlist as the foundation for structured outreach campaigns.",
    mockup: () => <CampaignToolsMockup />,
  },
];

const CYCLE_MS = 3200;

export function FeaturesInteractive() {
  const [active, setActive] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const goTo = useCallback((index: number) => {
    setActive(index);
    // bump cycleKey so the interval below restarts its window AND the
    // progress bar (keyed on cycleKey) restarts its fill from zero.
    setCycleKey((k) => k + 1);
  }, []);

  // Auto-advances forever. The earlier version paused on mouseEnter over the
  // whole panel and only resumed on mouseLeave — since the panel fills most
  // of the viewport, hovering it to look (without moving the mouse away)
  // silently froze it after the first change. That pause behavior is gone now.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % FEATURES.length);
      setCycleKey((k) => k + 1);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [cycleKey]);

  const feature = FEATURES[active];

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[560px] text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            Platform Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 font-display text-[28px] font-bold leading-[1.25] tracking-[-0.02em] sm:text-[36px]"
          >
            Everything you need to build a better lead list.
          </motion.h2>
        </div>

        <div className="relative mt-10 grid grid-cols-1 items-stretch gap-8 rounded-[28px] border-2 border-border/80 bg-foreground/[0.015] p-5 sm:p-7 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:p-9">

          {/* dot-grid backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.35] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px] text-foreground/20"
          />

          {/* LEFT: layered preview */}
          <div className="relative z-10 flex justify-center py-4 lg:min-h-[400px] lg:py-0">
            {/* static back card for depth, like the reference shot */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[82%] w-[88%] -translate-x-[54%] -translate-y-[46%] rotate-[-4deg] rounded-2xl border-2 border-border/70 bg-card/60"
            />
            <div className="relative h-[360px] w-full max-w-[440px] lg:h-[370px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 18, rotate: 2, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -14, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  {feature.mockup()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: description + clickable list */}
          <div className="relative z-10 flex flex-col justify-center lg:min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mb-5 min-h-[92px]"
              >
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                  {feature.tag}
                </span>
                <h3 className="mt-2.5 font-display text-[20px] font-bold leading-snug tracking-[-0.01em]">{feature.title}</h3>
                <p className="mt-1.5 max-w-[440px] text-[13px] leading-[1.6] text-muted">{feature.description}</p>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map((f, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-current={isActive}
                    onClick={() => goTo(i)}
                    className="relative block overflow-hidden rounded-xl text-left"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="feature-active-bg"
                        className="absolute inset-0 rounded-xl border-2 border-primary/30 bg-primary/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2 px-3 py-2.5">
                      <f.icon className={`size-4 shrink-0 ${isActive ? "text-primary" : "text-muted"}`} strokeWidth={2.25} />
                      <span className={`flex-1 truncate text-[12.5px] font-semibold ${isActive ? "text-primary" : "text-foreground/85"}`}>
                        {f.title}
                      </span>
                      <ArrowRight
                        className={`size-3.5 shrink-0 transition-transform duration-300 ${isActive ? "translate-x-0 text-primary" : "-translate-x-1 text-muted/60"}`}
                      />
                    </span>
                    {isActive && (
                      <span className="relative mx-3 mb-2.5 block h-[2px] overflow-hidden rounded-full bg-primary/15">
                        <motion.span
                          key={cycleKey}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                          style={{ transformOrigin: "left" }}
                          className="block h-full bg-primary"
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
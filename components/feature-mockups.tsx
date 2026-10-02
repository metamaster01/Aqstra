// // import { Check, Mail, MessageSquare, Send, Sparkles } from "lucide-react";

// // /**
// //  * Six small, self-contained UI mockups — no image/video assets required.
// //  * Each mirrors the card language used elsewhere on the site (rounded corners,
// //  * soft shadow, tiny mono-ish labels) so the whole section feels native rather
// //  * than like a dropped-in screenshot. Swap any of these for a real screenshot
// //  * or looping clip later without touching the layout that hosts them.
// //  */

// // const card = "rounded-2xl border border-border bg-card p-5 shadow-[0_20px_45px_-20px_rgba(15,23,42,.25)]";

// // export function LeadDiscoveryMockup() {
// //   const rows = [
// //     { name: "Acme Technologies", meta: "Enterprise Software · SF" },
// //     { name: "Northwind Cloud", meta: "SaaS · Austin" },
// //     { name: "Vertex Analytics", meta: "Data Platform · Remote" },
// //   ];
// //   return (
// //     <div className={card}>
// //       <div className="mb-4 flex items-center justify-between">
// //         <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Search</span>
// //         <span className="text-[10px] text-muted">1,204 found</span>
// //       </div>
// //       <div className="mb-4 rounded-lg border border-border px-3 py-2 text-[11px] text-muted">
// //         companies like "series-b saas, 50-500 employees"
// //       </div>
// //       <div className="space-y-2">
// //         {rows.map((r, i) => (
// //           <div key={r.name} className="flex items-center gap-3 rounded-lg border border-border/70 p-2.5" style={{ opacity: 1 - i * 0.12 }}>
// //             <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
// //               {r.name[0]}
// //             </span>
// //             <div className="min-w-0 flex-1">
// //               <p className="truncate text-[11.5px] font-semibold">{r.name}</p>
// //               <p className="truncate text-[10px] text-muted">{r.meta}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export function PrecisionClassificationMockup() {
// //   const tags = [
// //     { label: "SaaS · B2B", on: true },
// //     { label: "50–500 employees", on: true },
// //     { label: "Series B+", on: true },
// //     { label: "US / EU", on: false },
// //   ];
// //   return (
// //     <div className={card}>
// //       <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Classifying prospect</span>
// //       <p className="mt-2 text-[13px] font-semibold">Acme Technologies</p>
// //       <div className="mt-4 flex flex-wrap gap-2">
// //         {tags.map((t) => (
// //           <span
// //             key={t.label}
// //             className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
// //               t.on ? "bg-primary/10 text-primary" : "bg-foreground/5 text-muted"
// //             }`}
// //           >
// //             {t.on && <Check className="size-2.5" strokeWidth={3} />}
// //             {t.label}
// //           </span>
// //         ))}
// //       </div>
// //       <div className="mt-5 flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2.5">
// //         <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Matches your ICP</span>
// //         <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">92%</span>
// //       </div>
// //     </div>
// //   );
// // }

// // export function SmartFilteringMockup() {
// //   const filters = [
// //     { label: "Industry", value: "SaaS", on: true },
// //     { label: "Location", value: "United States", on: true },
// //     { label: "Company size", value: "50–500", on: true },
// //     { label: "Intent signal", value: "High", on: false },
// //   ];
// //   return (
// //     <div className={card}>
// //       <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Active filters</span>
// //       <div className="mt-3 space-y-2">
// //         {filters.map((f) => (
// //           <div key={f.label} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
// //             <div className="text-[11px]"><span className="text-muted">{f.label}: </span><span className="font-medium">{f.value}</span></div>
// //             <span className={`h-4 w-7 rounded-full p-0.5 transition-colors ${f.on ? "bg-primary" : "bg-foreground/15"}`}>
// //               <span className={`block size-3 rounded-full bg-white transition-transform ${f.on ? "translate-x-3" : "translate-x-0"}`} />
// //             </span>
// //           </div>
// //         ))}
// //       </div>
// //       <div className="mt-4 flex items-center justify-between text-[10.5px] text-muted">
// //         <span>12,480 prospects</span>
// //         <span className="font-semibold text-primary">→ 340 relevant</span>
// //       </div>
// //     </div>
// //   );
// // }

// // export function LeadQualityMockup() {
// //   return (
// //     <div className={card}>
// //       <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Quality score</span>
// //       <div className="mt-4 flex items-center gap-4">
// //         <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
// //           <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
// //             <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500/20" />
// //             <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="14" strokeLinecap="round" className="text-emerald-500" />
// //           </svg>
// //           <span className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400">86</span>
// //         </div>
// //         <div className="space-y-1.5 text-[10.5px]">
// //           <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Verified contact details</p>
// //           <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Matches target criteria</p>
// //           <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Active buying signals</p>
// //         </div>
// //       </div>
// //       <div className="mt-4 rounded-lg bg-foreground/[0.04] px-3 py-2 text-[10.5px] text-muted">Qualified — added to shortlist</div>
// //     </div>
// //   );
// // }

// // export function LeadIntelligenceMockup() {
// //   return (
// //     <div className={card}>
// //       <div className="flex items-center gap-3">
// //         <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">JC</span>
// //         <div>
// //           <p className="text-[12px] font-semibold">John Carter</p>
// //           <p className="text-[10px] text-muted">VP Sales · Acme Technologies</p>
// //         </div>
// //       </div>
// //       <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
// //         <div className="rounded-lg bg-foreground/[0.04] px-2.5 py-2"><p className="text-muted">Company size</p><p className="font-semibold">210 employees</p></div>
// //         <div className="rounded-lg bg-foreground/[0.04] px-2.5 py-2"><p className="text-muted">Funding</p><p className="font-semibold">Series B</p></div>
// //       </div>
// //       <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/5 px-2.5 py-2 text-[10px] text-primary">
// //         <Sparkles className="size-3" /> Recently visited pricing page 3×
// //       </div>
// //     </div>
// //   );
// // }

// // export function CampaignToolsMockup() {
// //   const steps = [
// //     { icon: Mail, label: "Intro email", done: true },
// //     { icon: MessageSquare, label: "Follow-up", done: true },
// //     { icon: Send, label: "Final nudge", done: false },
// //   ];
// //   return (
// //     <div className={card}>
// //       <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Outreach sequence</span>
// //       <div className="mt-3 space-y-2.5">
// //         {steps.map((s) => (
// //           <div key={s.label} className="flex items-center gap-3">
// //             <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-primary text-white" : "border border-dashed border-border text-muted"}`}>
// //               <s.icon className="size-3.5" />
// //             </span>
// //             <span className={`text-[11px] ${s.done ? "font-medium" : "text-muted"}`}>{s.label}</span>
// //             {s.done && <Check className="ml-auto size-3.5 text-emerald-500" strokeWidth={3} />}
// //           </div>
// //         ))}
// //       </div>
// //       <div className="mt-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
// //         38% reply rate this campaign
// //       </div>
// //     </div>
// //   );
// // }





// import { Check, Mail, MessageSquare, Send, Sparkles, TrendingUp } from "lucide-react";

// /**
//  * Six self-contained UI mockups, each roughly the same footprint (they fill
//  * a fixed-height parent via h-full flex flex-col justify-between) so the
//  * preview panel never jumps in height as the active feature cycles.
//  *
//  * Every mockup now carries a small hand-drawn chart illustrating the *result*
//  * of that feature (growth, narrowing, scoring, signal activity...) rather
//  * than just a static list — no image/GIF assets required. Swap any of these
//  * for a real screenshot or looping clip later without touching the layout.
//  */

// const card = "flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-[0_20px_45px_-20px_rgba(15,23,42,.25)]";
// const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.1em] text-muted";

// /* ---------------------------------------------------------------- */
// /* 1. Lead Discovery — results list + volume-over-time bar chart     */
// /* ---------------------------------------------------------------- */
// export function LeadDiscoveryMockup() {
//   const rows = [
//     { name: "Acme Technologies", meta: "Enterprise Software · SF" },
//     { name: "Northwind Cloud", meta: "SaaS · Austin" },
//     { name: "Vertex Analytics", meta: "Data Platform · Remote" },
//   ];
//   const bars = [22, 34, 30, 48, 62, 58, 80];
//   return (
//     <div className={card}>
//       <div>
//         <div className="mb-4 flex items-center justify-between">
//           <span className={eyebrow}>Search</span>
//           <span className="text-[10px] text-muted">1,204 found</span>
//         </div>
//         <div className="mb-4 rounded-lg border border-border px-3 py-2.5 text-[11.5px] text-muted">
//           companies like "series-b saas, 50–500 employees"
//         </div>
//         <div className="space-y-2">
//           {rows.map((r, i) => (
//             <div key={r.name} className="flex items-center gap-3 rounded-lg border border-border/70 p-2.5" style={{ opacity: 1 - i * 0.12 }}>
//               <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
//                 {r.name[0]}
//               </span>
//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-[11.5px] font-semibold">{r.name}</p>
//                 <p className="truncate text-[10px] text-muted">{r.meta}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-5 rounded-lg bg-foreground/[0.03] p-3">
//         <div className="mb-2 flex items-center justify-between text-[10px] text-muted">
//           <span>New matches this week</span>
//           <span className="flex items-center gap-1 font-semibold text-emerald-500"><TrendingUp className="size-3" />+63%</span>
//         </div>
//         <div className="flex h-10 items-end gap-1.5">
//           {bars.map((h, i) => (
//             <span key={i} className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${h}%` }} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------------- */
// /* 2. Precision Classification — tags + criteria-match breakdown     */
// /* ---------------------------------------------------------------- */
// export function PrecisionClassificationMockup() {
//   const tags = [
//     { label: "SaaS · B2B", on: true },
//     { label: "50–500 employees", on: true },
//     { label: "Series B+", on: true },
//     { label: "US / EU", on: false },
//   ];
//   const breakdown = [
//     { label: "Industry fit", pct: 96 },
//     { label: "Company size", pct: 88 },
//     { label: "Funding stage", pct: 74 },
//     { label: "Geography", pct: 52 },
//   ];
//   return (
//     <div className={card}>
//       <div>
//         <span className={eyebrow}>Classifying prospect</span>
//         <p className="mt-2 text-[13px] font-semibold">Acme Technologies</p>
//         <div className="mt-3 flex flex-wrap gap-2">
//           {tags.map((t) => (
//             <span
//               key={t.label}
//               className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
//                 t.on ? "bg-primary/10 text-primary" : "bg-foreground/5 text-muted"
//               }`}
//             >
//               {t.on && <Check className="size-2.5" strokeWidth={3} />}
//               {t.label}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="mt-5 space-y-2.5">
//         <span className={eyebrow}>Criteria match across dataset</span>
//         {breakdown.map((b) => (
//           <div key={b.label} className="flex items-center gap-3">
//             <span className="w-[92px] shrink-0 text-[10.5px] text-muted">{b.label}</span>
//             <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
//               <span className="block h-full rounded-full bg-primary" style={{ width: `${b.pct}%` }} />
//             </span>
//             <span className="w-8 shrink-0 text-right text-[10.5px] font-semibold">{b.pct}%</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------------- */
// /* 3. Smart Filtering — funnel narrowing from raw traffic → relevant */
// /* ---------------------------------------------------------------- */
// export function SmartFilteringMockup() {
//   const stages = [
//     { label: "Raw dataset", value: "12,480", pct: 100 },
//     { label: "Industry + size match", value: "3,210", pct: 68 },
//     { label: "Intent signal present", value: "890", pct: 40 },
//     { label: "Relevant shortlist", value: "340", pct: 20 },
//   ];
//   return (
//     <div className={card}>
//       <div>
//         <span className={eyebrow}>Filter pipeline</span>
//         <p className="mt-2 text-[13px] font-semibold">Narrowing to relevant prospects</p>
//       </div>

//       <div className="mt-5 space-y-2.5">
//         {stages.map((s, i) => (
//           <div key={s.label}>
//             <div className="mb-1 flex items-center justify-between text-[10.5px]">
//               <span className="text-muted">{s.label}</span>
//               <span className="font-semibold">{s.value}</span>
//             </div>
//             <div className="h-3 overflow-hidden rounded-full bg-foreground/[0.06]">
//               <div
//                 className={`h-full rounded-full ${i === stages.length - 1 ? "bg-primary" : "bg-primary/35"}`}
//                 style={{ width: `${s.pct}%` }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-5 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5 text-[11px]">
//         <span className="text-muted">Noise removed</span>
//         <span className="font-semibold text-primary">97.3%</span>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------------- */
// /* 4. Lead Quality — score gauge + trend line across recent batches  */
// /* ---------------------------------------------------------------- */
// export function LeadQualityMockup() {
//   const points = [58, 63, 60, 71, 76, 74, 86];
//   const path = points
//     .map((p, i) => `${(i / (points.length - 1)) * 100},${100 - p}`)
//     .join(" ");
//   return (
//     <div className={card}>
//       <div>
//         <span className={eyebrow}>Quality score</span>
//         <div className="mt-4 flex items-center gap-4">
//           <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
//             <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
//               <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500/20" />
//               <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="14" strokeLinecap="round" className="text-emerald-500" />
//             </svg>
//             <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400">86</span>
//           </div>
//           <div className="space-y-1.5 text-[10.5px]">
//             <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Verified contact details</p>
//             <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Matches target criteria</p>
//             <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Active buying signals</p>
//           </div>
//         </div>
//       </div>

//       <div className="mt-5 rounded-lg bg-foreground/[0.03] p-3">
//         <div className="mb-2 flex items-center justify-between text-[10px] text-muted">
//           <span>Avg. quality score, last 7 batches</span>
//           <span className="flex items-center gap-1 font-semibold text-emerald-500"><TrendingUp className="size-3" />+28pts</span>
//         </div>
//         <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-10 w-full overflow-visible">
//           <polyline points={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" vectorEffect="non-scaling-stroke" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------------- */
// /* 5. Lead Intelligence — contact card + intent-signal timeline      */
// /* ---------------------------------------------------------------- */
// export function LeadIntelligenceMockup() {
//   const days = [2, 5, 3, 8, 4, 14, 22]; // signal strength, last 7 days
//   return (
//     <div className={card}>
//       <div>
//         <span className={eyebrow}>Enriched profile</span>
//         <div className="mt-3 flex items-center gap-3">
//           <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">JC</span>
//           <div>
//             <p className="text-[12px] font-semibold">John Carter</p>
//             <p className="text-[10px] text-muted">VP Sales · Acme Technologies</p>
//           </div>
//         </div>
//         <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
//           <div className="rounded-lg bg-foreground/[0.04] px-2.5 py-2"><p className="text-muted">Company size</p><p className="font-semibold">210 employees</p></div>
//           <div className="rounded-lg bg-foreground/[0.04] px-2.5 py-2"><p className="text-muted">Funding</p><p className="font-semibold">Series B</p></div>
//         </div>
//       </div>

//       <div className="mt-5 rounded-lg bg-foreground/[0.03] p-3">
//         <div className="mb-2.5 flex items-center gap-1.5 text-[10px] text-primary">
//           <Sparkles className="size-3" /> Intent signal activity, last 7 days
//         </div>
//         <div className="flex h-10 items-end gap-1.5">
//           {days.map((d, i) => (
//             <span key={i} className={`flex-1 rounded-sm ${i === days.length - 1 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${(d / 22) * 100}%` }} />
//           ))}
//         </div>
//         <p className="mt-2 text-[10px] text-muted">Spike on Day 7 — visited pricing page 3×</p>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------------- */
// /* 6. Campaign Tools — sequence steps + reply-rate trend              */
// /* ---------------------------------------------------------------- */
// export function CampaignToolsMockup() {
//   const steps = [
//     { icon: Mail, label: "Intro email", done: true },
//     { icon: MessageSquare, label: "Follow-up", done: true },
//     { icon: Send, label: "Final nudge", done: false },
//   ];
//   const replyRate = [12, 18, 22, 31, 38];
//   return (
//     <div className={card}>
//       <div>
//         <span className={eyebrow}>Outreach sequence</span>
//         <div className="mt-3 space-y-2.5">
//           {steps.map((s) => (
//             <div key={s.label} className="flex items-center gap-3">
//               <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-primary text-white" : "border border-dashed border-border text-muted"}`}>
//                 <s.icon className="size-3.5" />
//               </span>
//               <span className={`text-[11px] ${s.done ? "font-medium" : "text-muted"}`}>{s.label}</span>
//               {s.done && <Check className="ml-auto size-3.5 text-emerald-500" strokeWidth={3} />}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-5 rounded-lg bg-foreground/[0.03] p-3">
//         <div className="mb-2 flex items-center justify-between text-[10px] text-muted">
//           <span>Reply rate across sends</span>
//           <span className="flex items-center gap-1 font-semibold text-emerald-500"><TrendingUp className="size-3" />38%</span>
//         </div>
//         <div className="flex h-10 items-end gap-1.5">
//           {replyRate.map((h, i) => (
//             <span key={i} className={`flex-1 rounded-sm ${i === replyRate.length - 1 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${(h / 38) * 100}%` }} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









import { Check, Mail, MessageSquare, Send, Sparkles, TrendingUp } from "lucide-react";

/**
 * Six self-contained UI mockups, each roughly the same footprint (they fill
 * a fixed-height parent via h-full flex flex-col justify-between) so the
 * preview panel never jumps in height as the active feature cycles.
 *
 * Every mockup now carries a small hand-drawn chart illustrating the *result*
 * of that feature (growth, narrowing, scoring, signal activity...) rather
 * than just a static list — no image/GIF assets required. Swap any of these
 * for a real screenshot or looping clip later without touching the layout.
 */

const card = "flex h-full flex-col justify-between rounded-2xl border-2 border-border/80 bg-card p-5 shadow-[0_20px_45px_-20px_rgba(15,23,42,.25)]";
const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.1em] text-muted";

/* ---------------------------------------------------------------- */
/* 1. Lead Discovery — results list + volume-over-time bar chart     */
/* ---------------------------------------------------------------- */
export function LeadDiscoveryMockup() {
  const rows = [
    { name: "Acme Technologies", meta: "Enterprise Software · SF" },
    { name: "Northwind Cloud", meta: "SaaS · Austin" },
    { name: "Vertex Analytics", meta: "Data Platform · Remote" },
  ];
  const bars = [22, 34, 30, 48, 62, 58, 80];
  return (
    <div className={card}>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className={eyebrow}>Search</span>
          <span className="text-[10px] text-muted">1,204 found</span>
        </div>
        <div className="mb-3 rounded-lg border border-border px-3 py-2.5 text-[11.5px] text-muted">
          companies like "series-b saas, 50–500 employees"
        </div>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3 rounded-lg border border-border/70 p-2.5" style={{ opacity: 1 - i * 0.12 }}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                {r.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-semibold">{r.name}</p>
                <p className="truncate text-[10px] text-muted">{r.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-foreground/[0.03] p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] text-muted">
          <span>New matches this week</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-500"><TrendingUp className="size-3" />+63%</span>
        </div>
        <div className="flex h-10 items-end gap-1.5">
          {bars.map((h, i) => (
            <span key={i} className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 2. Precision Classification — tags + criteria-match breakdown     */
/* ---------------------------------------------------------------- */
export function PrecisionClassificationMockup() {
  const tags = [
    { label: "SaaS · B2B", on: true },
    { label: "50–500 employees", on: true },
    { label: "Series B+", on: true },
    { label: "US / EU", on: false },
  ];
  const breakdown = [
    { label: "Industry fit", pct: 96 },
    { label: "Company size", pct: 88 },
    { label: "Funding stage", pct: 74 },
    { label: "Geography", pct: 52 },
  ];
  return (
    <div className={card}>
      <div>
        <span className={eyebrow}>Classifying prospect</span>
        <p className="mt-2 text-[13px] font-semibold">Acme Technologies</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t.label}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                t.on ? "bg-primary/10 text-primary" : "bg-foreground/5 text-muted"
              }`}
            >
              {t.on && <Check className="size-2.5" strokeWidth={3} />}
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <span className={eyebrow}>Criteria match across dataset</span>
        {breakdown.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-[92px] shrink-0 text-[10.5px] text-muted">{b.label}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${b.pct}%` }} />
            </span>
            <span className="w-8 shrink-0 text-right text-[10.5px] font-semibold">{b.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 3. Smart Filtering — funnel narrowing from raw traffic → relevant */
/* ---------------------------------------------------------------- */
export function SmartFilteringMockup() {
  const stages = [
    { label: "Raw dataset", value: "12,480", pct: 100 },
    { label: "Industry + size match", value: "3,210", pct: 68 },
    { label: "Intent signal present", value: "890", pct: 40 },
    { label: "Relevant shortlist", value: "340", pct: 20 },
  ];
  return (
    <div className={card}>
      <div>
        <span className={eyebrow}>Filter pipeline</span>
        <p className="mt-2 text-[13px] font-semibold">Narrowing to relevant prospects</p>
      </div>

      <div className="mt-4 space-y-2.5">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-[10.5px]">
              <span className="text-muted">{s.label}</span>
              <span className="font-semibold">{s.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-foreground/[0.06]">
              <div
                className={`h-full rounded-full ${i === stages.length - 1 ? "bg-primary" : "bg-primary/35"}`}
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5 text-[11px]">
        <span className="text-muted">Noise removed</span>
        <span className="font-semibold text-primary">97.3%</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 4. Lead Quality — score gauge + trend line across recent batches  */
/* ---------------------------------------------------------------- */
export function LeadQualityMockup() {
  const points = [58, 63, 60, 71, 76, 74, 86];
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${100 - p}`)
    .join(" ");
  return (
    <div className={card}>
      <div>
        <span className={eyebrow}>Quality score</span>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500/20" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="14" strokeLinecap="round" className="text-emerald-500" />
            </svg>
            <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400">86</span>
          </div>
          <div className="space-y-1.5 text-[10.5px]">
            <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Verified contact details</p>
            <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Matches target criteria</p>
            <p className="flex items-center gap-1.5"><Check className="size-3 text-emerald-500" strokeWidth={3} />Active buying signals</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-foreground/[0.03] p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] text-muted">
          <span>Avg. quality score, last 7 batches</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-500"><TrendingUp className="size-3" />+28pts</span>
        </div>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-10 w-full overflow-visible">
          <polyline points={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 5. Lead Intelligence — contact card + intent-signal timeline      */
/* ---------------------------------------------------------------- */
export function LeadIntelligenceMockup() {
  const days = [2, 5, 3, 8, 4, 14, 22]; // signal strength, last 7 days
  return (
    <div className={card}>
      <div>
        <span className={eyebrow}>Enriched profile</span>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">JC</span>
          <div>
            <p className="text-[12px] font-semibold">John Carter</p>
            <p className="text-[10px] text-muted">VP Sales · Acme Technologies</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-lg bg-foreground/[0.04] px-2.5 py-2"><p className="text-muted">Company size</p><p className="font-semibold">210 employees</p></div>
          <div className="rounded-lg bg-foreground/[0.04] px-2.5 py-2"><p className="text-muted">Funding</p><p className="font-semibold">Series B</p></div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-foreground/[0.03] p-3">
        <div className="mb-2.5 flex items-center gap-1.5 text-[10px] text-primary">
          <Sparkles className="size-3" /> Intent signal activity, last 7 days
        </div>
        <div className="flex h-10 items-end gap-1.5">
          {days.map((d, i) => (
            <span key={i} className={`flex-1 rounded-sm ${i === days.length - 1 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${(d / 22) * 100}%` }} />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-muted">Spike on Day 7 — visited pricing page 3×</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 6. Campaign Tools — sequence steps + reply-rate trend              */
/* ---------------------------------------------------------------- */
export function CampaignToolsMockup() {
  const steps = [
    { icon: Mail, label: "Intro email", done: true },
    { icon: MessageSquare, label: "Follow-up", done: true },
    { icon: Send, label: "Final nudge", done: false },
  ];
  const replyRate = [12, 18, 22, 31, 38];
  return (
    <div className={card}>
      <div>
        <span className={eyebrow}>Outreach sequence</span>
        <div className="mt-3 space-y-2.5">
          {steps.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-primary text-white" : "border border-dashed border-border text-muted"}`}>
                <s.icon className="size-3.5" />
              </span>
              <span className={`text-[11px] ${s.done ? "font-medium" : "text-muted"}`}>{s.label}</span>
              {s.done && <Check className="ml-auto size-3.5 text-emerald-500" strokeWidth={3} />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-foreground/[0.03] p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] text-muted">
          <span>Reply rate across sends</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-500"><TrendingUp className="size-3" />38%</span>
        </div>
        <div className="flex h-10 items-end gap-1.5">
          {replyRate.map((h, i) => (
            <span key={i} className={`flex-1 rounded-sm ${i === replyRate.length - 1 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${(h / 38) * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
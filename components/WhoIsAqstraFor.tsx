// "use client";

// /**
//  * <WhoIsAqstraFor /> ("Built for People Who Are Serious About Finding Their
//  * Next Opportunity.")
//  *
//  * Uses the same tokens as Hero / Workflow / Precision (bg-background,
//  * text-foreground, text-muted, border-border, bg-card, text-primary) plus
//  * `dark:` variants, so it follows the existing theme toggle.
//  * Needs: framer-motion, lucide-react, next/link.
//  */

// import { motion, useReducedMotion, type Variants } from "framer-motion";
// import Link from "next/link";
// import {
//   Target,
//   Handshake,
//   Megaphone,
//   Rocket,
//   TrendingUp,
//   Briefcase,
//   ArrowUpRight,
//   type LucideIcon,
// } from "lucide-react";

// const EASE = [0.22, 1, 0.36, 1] as const;
// const VIEWPORT = { once: true, margin: "-80px" } as const;

// type Audience = {
//   title: string;
//   description: string;
//   link: string;
//   icon: LucideIcon;
// };

// const AUDIENCES: Audience[] = [
//   {
//     title: "Sales Teams",
//     description:
//       "Find relevant prospects and organize your sales prospecting activities.",
//     link: "/solutions/sales",
//     icon: Target,
//   },
//   {
//     title: "Business Development",
//     description:
//       "Identify potential companies, partnerships and expansion opportunities.",
//     link: "/solutions/business-development",
//     icon: Handshake,
//   },
//   {
//     title: "Marketing Agencies",
//     description:
//       "Discover businesses that align with your service offerings and target audience.",
//     link: "/solutions",
//     icon: Megaphone,
//   },
//   {
//     title: "Founders & Startups",
//     description: "Research potential customers and explore new markets.",
//     link: "/solutions",
//     icon: Rocket,
//   },
//   {
//     title: "Growth Teams",
//     description:
//       "Support customer acquisition and market research with structured prospect discovery.",
//     link: "/solutions/growth",
//     icon: TrendingUp,
//   },
//   {
//     title: "Consultants & Professionals",
//     description:
//       "Identify relevant companies and potential business opportunities.",
//     link: "/solutions",
//     icon: Briefcase,
//   },
// ];

// export function WhoIsAqstraFor() {
//   const reduce = useReducedMotion();

//   const container: Variants = {
//     hidden: {},
//     show: {
//       transition: {
//         staggerChildren: reduce ? 0 : 0.09,
//         delayChildren: reduce ? 0 : 0.1,
//       },
//     },
//   };
//   const item: Variants = {
//     hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
//   };

//   return (
//     <section
//       aria-labelledby="who-is-aqstra-for"
//       className="relative overflow-hidden bg-background px-6 py-16 sm:px-10 sm:py-24 lg:px-20"
//     >
//       {/* Ambient glow: soft in light, a bit deeper in dark */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-300/30 via-indigo-300/30 to-violet-300/30 blur-3xl dark:from-blue-500/15 dark:via-indigo-500/15 dark:to-violet-500/20"
//       />
//       {/* Dot grid, uses the foreground colour so it adapts to the theme */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 text-foreground/[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] dark:text-foreground/[0.09]"
//       />

//       <div className="relative mx-auto max-w-[1100px]">
//         {/* Heading */}
//         <motion.div
//           initial={reduce ? false : { opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={VIEWPORT}
//           transition={{ duration: 0.6, ease: EASE }}
//           className="mx-auto max-w-3xl text-center"
//         >
//           <h2
//             id="who-is-aqstra-for"
//             className="font-display font-extrabold text-foreground"
//             // inline: a global h2 rule in the site CSS can override utility font sizes
//             style={{
//               fontSize: "clamp(28px, 3.6vw, 44px)",
//               lineHeight: 1.1,
//               letterSpacing: "-0.03em",
//               margin: 0,
//             }}
//           >
//             Built for People Who Are Serious About Finding Their{" "}
//             <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
//               Next Opportunity.
//             </span>
//           </h2>
//         </motion.div>

//         {/* Cards */}
//         <motion.ul
//           variants={container}
//           initial="hidden"
//           whileInView="show"
//           viewport={VIEWPORT}
//           className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-5"
//         >
//           {AUDIENCES.map(({ icon: Icon, title, description, link }, i) => (
//             <motion.li
//               key={title}
//               variants={item}
//               whileHover={reduce ? undefined : { y: -6 }}
//               transition={{ type: "spring", stiffness: 300, damping: 22 }}
//               className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 focus-within:border-primary hover:border-primary hover:shadow-[0_20px_40px_-16px] hover:shadow-primary/30 dark:border-white/25 dark:bg-white/[0.03] dark:hover:border-primary dark:focus-within:border-primary sm:p-7"
//             >
//               {/* Hover sheen */}
//               <div
//                 aria-hidden
//                 className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-violet-500/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
//               />

//               <div className="relative flex items-start justify-between">
//                 <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
//                   <Icon className="size-[22px]" strokeWidth={1.9} aria-hidden />
//                 </span>
//                 <span
//                   aria-hidden
//                   className="text-sm font-semibold tabular-nums text-muted/60 transition-colors group-hover:text-primary"
//                 >
//                   {String(i + 1).padStart(2, "0")}
//                 </span>
//               </div>

//               <h3 className="relative mt-6 text-[17px] font-bold text-foreground">
//                 {title}
//               </h3>
//               <p className="relative mt-2 flex-1 text-[14px] leading-relaxed text-muted">
//                 {description}
//               </p>

//               {/*
//                 Stretched link: the ::after covers the whole card, so the entire
//                 card is clickable. Always visible on touch / small screens,
//                 revealed on hover (and keyboard focus) from md up.
//               */}
//               <Link
//                 href={link}
//                 aria-label={`Learn more about AQSTRA for ${title}`}
//                 className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-opacity duration-300 after:absolute after:inset-0 after:content-[''] focus-visible:opacity-100 focus-visible:outline-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
//               >
//                 <span className="inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
//                   Learn more
//                   <ArrowUpRight className="size-4" aria-hidden />
//                 </span>
//               </Link>
//             </motion.li>
//           ))}
//         </motion.ul>
//       </div>
//     </section>
//   );
// }

// export default WhoIsAqstraFor;



// "use client";

// /**
//  * <WhoIsAqstraFor /> ("Built for People Who Are Serious About Finding Their
//  * Next Opportunity.")
//  *
//  * Uses the same tokens as Hero / Workflow / Precision (bg-background,
//  * text-foreground, text-muted, border-border, bg-card, text-primary) plus
//  * `dark:` variants, so it follows the existing theme toggle.
//  * Needs: framer-motion, lucide-react, next/link.
//  */

// import { motion, useReducedMotion, type Variants } from "framer-motion";
// import Link from "next/link";
// import {
//   Target,
//   Handshake,
//   Megaphone,
//   Rocket,
//   TrendingUp,
//   Briefcase,
//   ArrowUpRight,
//   type LucideIcon,
// } from "lucide-react";

// const EASE = [0.22, 1, 0.36, 1] as const;
// const VIEWPORT = { once: true, margin: "-80px" } as const;

// type Audience = {
//   title: string;
//   description: string;
//   link: string;
//   icon: LucideIcon;
// };

// const AUDIENCES: Audience[] = [
//   {
//     title: "Sales Teams",
//     description:
//       "Find relevant prospects and organize your sales prospecting activities.",
//     link: "/solutions/sales",
//     icon: Target,
//   },
//   {
//     title: "Business Development",
//     description:
//       "Identify potential companies, partnerships and expansion opportunities.",
//     link: "/solutions/business-development",
//     icon: Handshake,
//   },
//   {
//     title: "Marketing Agencies",
//     description:
//       "Discover businesses that align with your service offerings and target audience.",
//     link: "/solutions",
//     icon: Megaphone,
//   },
//   {
//     title: "Founders & Startups",
//     description: "Research potential customers and explore new markets.",
//     link: "/solutions",
//     icon: Rocket,
//   },
//   {
//     title: "Growth Teams",
//     description:
//       "Support customer acquisition and market research with structured prospect discovery.",
//     link: "/solutions/growth",
//     icon: TrendingUp,
//   },
//   {
//     title: "Consultants & Professionals",
//     description:
//       "Identify relevant companies and potential business opportunities.",
//     link: "/solutions",
//     icon: Briefcase,
//   },
// ];

// export function WhoIsAqstraFor() {
//   const reduce = useReducedMotion();

//   const container: Variants = {
//     hidden: {},
//     show: {
//       transition: {
//         staggerChildren: reduce ? 0 : 0.09,
//         delayChildren: reduce ? 0 : 0.1,
//       },
//     },
//   };
//   const item: Variants = {
//     hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
//   };

//   return (
//     <section
//       aria-labelledby="who-is-aqstra-for"
//       className="relative overflow-hidden bg-background px-6 py-16 sm:px-10 sm:py-24 lg:px-20"
//     >
//       {/*
//         Ambient glow: lives fully INSIDE the section and fades to transparent
//         before it reaches any edge (radial gradients, no blur box), so nothing
//         is clipped and there is no visible seam with the section above.
//         Two overlapping ellipses: blue on the left, violet on the right.
//       */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_50%_50%_at_35%_38%,rgb(59_130_246/0.16),transparent_70%),radial-gradient(ellipse_50%_50%_at_65%_38%,rgb(139_92_246/0.18),transparent_70%)] dark:bg-[radial-gradient(ellipse_50%_50%_at_35%_38%,rgb(59_130_246/0.20),transparent_70%),radial-gradient(ellipse_50%_50%_at_65%_38%,rgb(139_92_246/0.26),transparent_70%)]"
//       />
//       {/* Dot grid: same box as the glow, masked to 0 at its edges, theme-aware colour */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-x-0 top-0 h-[520px] text-foreground/[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_closest-side,black_30%,transparent_100%)] dark:text-foreground/[0.09]"
//       />

//       <div className="relative mx-auto max-w-[1100px]">
//         {/* Heading */}
//         <motion.div
//           initial={reduce ? false : { opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={VIEWPORT}
//           transition={{ duration: 0.6, ease: EASE }}
//           className="mx-auto max-w-3xl text-center"
//         >
//           <h2
//             id="who-is-aqstra-for"
//             className="font-display font-extrabold text-foreground"
//             // inline: a global h2 rule in the site CSS can override utility font sizes
//             style={{
//               fontSize: "clamp(28px, 3.6vw, 44px)",
//               lineHeight: 1.1,
//               letterSpacing: "-0.03em",
//               margin: 0,
//             }}
//           >
//             Built for People Who Are Serious About Finding Their{" "}
//             <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
//               Next Opportunity.
//             </span>
//           </h2>
//         </motion.div>

//         {/* Cards */}
//         <motion.ul
//           variants={container}
//           initial="hidden"
//           whileInView="show"
//           viewport={VIEWPORT}
//           className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-5"
//         >
//           {AUDIENCES.map(({ icon: Icon, title, description, link }, i) => (
//             <motion.li
//               key={title}
//               variants={item}
//               whileHover={reduce ? undefined : { y: -6 }}
//               transition={{ type: "spring", stiffness: 300, damping: 22 }}
//               className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 focus-within:border-primary hover:border-primary hover:shadow-[0_20px_40px_-16px] hover:shadow-primary/30 dark:border-white/25 dark:bg-white/[0.03] dark:hover:border-primary dark:focus-within:border-primary sm:p-7"
//             >
//               {/* Hover sheen */}
//               <div
//                 aria-hidden
//                 className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-violet-500/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
//               />

//               <div className="relative flex items-start justify-between">
//                 <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
//                   <Icon className="size-[22px]" strokeWidth={1.9} aria-hidden />
//                 </span>
//                 <span
//                   aria-hidden
//                   className="text-sm font-semibold tabular-nums text-muted/60 transition-colors group-hover:text-primary"
//                 >
//                   {String(i + 1).padStart(2, "0")}
//                 </span>
//               </div>

//               <h3 className="relative mt-6 text-[17px] font-bold text-foreground">
//                 {title}
//               </h3>
//               <p className="relative mt-2 flex-1 text-[14px] leading-relaxed text-muted">
//                 {description}
//               </p>

//               {/*
//                 Stretched link: the ::after covers the whole card, so the entire
//                 card is clickable. Always visible on touch / small screens,
//                 revealed on hover (and keyboard focus) from md up.
//               */}
//               <Link
//                 href={link}
//                 aria-label={`Learn more about AQSTRA for ${title}`}
//                 className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-opacity duration-300 after:absolute after:inset-0 after:content-[''] focus-visible:opacity-100 focus-visible:outline-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
//               >
//                 <span className="inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
//                   Learn more
//                   <ArrowUpRight className="size-4" aria-hidden />
//                 </span>
//               </Link>
//             </motion.li>
//           ))}
//         </motion.ul>
//       </div>
//     </section>
//   );
// }

// export default WhoIsAqstraFor;



"use client";

/**
 * <WhoIsAqstraFor /> ("Built for People Who Are Serious About Finding Their
 * Next Opportunity.")
 *
 * Uses the same tokens as Hero / Workflow / Precision (bg-background,
 * text-foreground, text-muted, border-border, bg-card, text-primary) plus
 * `dark:` variants, so it follows the existing theme toggle.
 * Needs: framer-motion, lucide-react, next/link.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Target,
  Handshake,
  Megaphone,
  Rocket,
  TrendingUp,
  Briefcase,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

type Audience = {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
};

const AUDIENCES: Audience[] = [
  {
    title: "Sales Teams",
    description:
      "Find relevant prospects and organize your sales prospecting activities.",
    link: "/solutions/sales",
    icon: Target,
  },
  {
    title: "Business Development",
    description:
      "Identify potential companies, partnerships and expansion opportunities.",
    link: "/solutions/business-development",
    icon: Handshake,
  },
  {
    title: "Marketing Agencies",
    description:
      "Discover businesses that align with your service offerings and target audience.",
    link: "/solutions",
    icon: Megaphone,
  },
  {
    title: "Founders & Startups",
    description: "Research potential customers and explore new markets.",
    link: "/solutions",
    icon: Rocket,
  },
  {
    title: "Growth Teams",
    description:
      "Support customer acquisition and market research with structured prospect discovery.",
    link: "/solutions/growth",
    icon: TrendingUp,
  },
  {
    title: "Consultants & Professionals",
    description:
      "Identify relevant companies and potential business opportunities.",
    link: "/solutions",
    icon: Briefcase,
  },
];

export function WhoIsAqstraFor() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.09,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section
      aria-labelledby="who-is-aqstra-for"
      className="relative overflow-x-clip bg-background px-6 py-16 sm:px-10 sm:py-24 lg:px-20"
    >
      {/*
        Ambient glow, centred exactly on the boundary between the section above
        (DataFlow) and this one: top half spills over the bottom of DataFlow,
        bottom half sits at the top of this section. The box is 560px tall and
        pulled up by half of that (-top-[280px]); the gradients fade to fully
        transparent before the box edges, so nothing is clipped. It is
        pointer-events-none, so it never blocks clicks in either section.
        To shift it, change -top-[280px] (more negative = more into DataFlow).
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[280px] h-[560px] bg-[radial-gradient(ellipse_50%_50%_at_35%_50%,rgb(59_130_246/0.14),transparent_70%),radial-gradient(ellipse_50%_50%_at_65%_50%,rgb(139_92_246/0.16),transparent_70%)] dark:bg-[radial-gradient(ellipse_50%_50%_at_35%_50%,rgb(59_130_246/0.18),transparent_70%),radial-gradient(ellipse_50%_50%_at_65%_50%,rgb(139_92_246/0.24),transparent_70%)]"
      />
      {/* Dot grid: only inside this section, fades to 0 at its own edges (no seam) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] text-foreground/[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_closest-side,black_30%,transparent_100%)] dark:text-foreground/[0.09]"
      />

      <div className="relative mx-auto max-w-[1100px]">
        {/* Heading */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="who-is-aqstra-for"
            className="font-display font-bold text-foreground"
            // inline: a global h2 rule in the site CSS can override utility font sizes
            style={{
              fontSize: "clamp(28px, 3.6vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Built for People Who Are Serious About Finding Their{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              Next Opportunity.
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-5"
        >
          {AUDIENCES.map(({ icon: Icon, title, description, link }, i) => (
            <motion.li
              key={title}
              variants={item}
              whileHover={reduce ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 focus-within:border-primary hover:border-primary hover:shadow-[0_20px_40px_-16px] hover:shadow-primary/30 dark:border-white/25 dark:bg-white/[0.03] dark:hover:border-primary dark:focus-within:border-primary sm:p-7"
            >
              {/* Hover sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-violet-500/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
              />

              <div className="relative flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                  <Icon className="size-[22px]" strokeWidth={1.9} aria-hidden />
                </span>
                <span
                  aria-hidden
                  className="text-sm font-semibold tabular-nums text-muted/60 transition-colors group-hover:text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="relative mt-6 text-[17px] font-bold text-foreground">
                {title}
              </h3>
              <p className="relative mt-2 flex-1 text-[14px] leading-relaxed text-muted">
                {description}
              </p>

              {/*
                Stretched link: the ::after covers the whole card, so the entire
                card is clickable. Always visible on touch / small screens,
                revealed on hover (and keyboard focus) from md up.
              */}
              <Link
                href={link}
                aria-label={`Learn more about AQSTRA for ${title}`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-opacity duration-300 after:absolute after:inset-0 after:content-[''] focus-visible:opacity-100 focus-visible:outline-none md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
              >
                <span className="inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                  Learn more
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default WhoIsAqstraFor;
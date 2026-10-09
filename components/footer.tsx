// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import { TextHoverEffect } from "@/components/ui/text-hover-effect";

// /**
//  * Content below is taken directly from the reference screenshot (column
//  * headings, links, tagline, copyright line). No social-icon row was in that
//  * screenshot, so none is added here — easy to add back later if wanted.
//  *
//  * Same fixed-dark styling as CtaSection (#0a0e1a) in both site themes, and
//  * sits directly under it with a 2px primary-colored top border, matching
//  * the blue divider line in the reference image.
//  */
// const FOOTER_COLUMNS = [
//   {
//     title: "Product",
//     links: ["Lead Intelligence", "Lead Discovery", "Lead Scoring", "Data Enrichment", "Campaign Tools"],
//   },
//   {
//     title: "Solutions",
//     links: ["Sales Teams", "Business Development", "Growth Teams", "Outreach"],
//   },
//   {
//     title: "Resources",
//     links: ["Guides", "Knowledge Base", "Insights", "Industry News"],
//   },
//   {
//     title: "Company",
//     links: ["About", "Contact", "Pricing"],
//   },
// ];

// export function FooterSection() {
//   const year = new Date().getFullYear();

//   return (
//     <footer className="relative overflow-hidden border-t-2 border-primary bg-[#0a0e1a]">
//       <div className="relative mx-auto max-w-[1280px] px-6 pb-14 pt-16 sm:px-10 sm:pt-20 lg:px-20">
//         <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
//           <motion.div
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="col-span-2 sm:col-span-3 lg:col-span-1"
//           >
//             <span className="font-display text-[19px] font-extrabold tracking-tight text-white">AQSTRA</span>
//             <p className="mt-3 max-w-[220px] text-[13px] leading-[1.6] text-white/45">
//               Precision lead intelligence for modern sales teams.
//             </p>
//           </motion.div>

//           {FOOTER_COLUMNS.map((col, i) => (
//             <motion.div
//               key={col.title}
//               initial={{ opacity: 0, y: 14 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.08 * (i + 1) }}
//             >
//               <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/45">{col.title}</h4>
//               <ul className="mt-4 space-y-2.5">
//                 {col.links.map((link) => (
//                   <li key={link}>
//                     <Link href="#" className="text-[13px] text-white/70 transition-colors hover:text-primary">
//                       {link}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           ))}
//         </div>

//         <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
//           <p className="text-[12.5px] text-white/40">© {year} MetaMaster. All rights reserved.</p>
//           <div className="flex items-center gap-6">
//             <Link href="#" className="text-[12.5px] text-white/40 transition-colors hover:text-white/70">
//               Privacy Policy
//             </Link>
//             <Link href="#" className="text-[12.5px] text-white/40 transition-colors hover:text-white/70">
//               Terms of Service
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* giant cursor-reactive brand mark */}
//       <div className="hidden h-[16rem] sm:h-[20rem] lg:flex lg:h-[22rem]">
//         <TextHoverEffect text="AQSTRA" duration={0.3} />
//       </div>

//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
//         style={{ background: "radial-gradient(125% 125% at 50% 100%, transparent 40%, rgba(37,99,235,.12) 100%)" }}
//       />
//     </footer>
//   );
// }





"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

/**
 * Content below is taken directly from the reference screenshot (column
 * headings, links, tagline, copyright line). No social-icon row was in that
 * screenshot, so none is added here — easy to add back later if wanted.
 *
 * Same fixed-dark styling as CtaSection (#0a0e1a) in both site themes, and
 * sits directly under it with a 2px primary-colored top border, matching
 * the blue divider line in the reference image.
 */
// href "#" = no destination yet; swap it in when that page exists.
const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Lead Intelligence", href: "/product" },
      { label: "Lead Discovery", href: "/product#lead-discovery" },
      { label: "Lead Scoring", href: "/product#lead-scoring" },
      { label: "Data Enrichment", href: "/product" },
      { label: "Campaign Tools", href: "/product#campaign-tools" },
    ],
  },
 {
    title: "Solutions",
    links: [
      { label: "Sales Teams", href: "/solutions/sales" },
      { label: "Business Development", href: "/solutions/business-development" },
      { label: "Growth Teams", href: "/solutions/growth" },
      { label: "Outreach", href: "/solutions/outreach" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/resource/all?type=Guide" },
      { label: "Knowledge Base", href: "/docs/introduction" },
      { label: "Insights", href: "/resource/all?type=Article" },
      { label: "Industry News", href: "/news" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/contact" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0a0e1a]">
      <div className="relative mx-auto max-w-[1280px] px-6 pb-14 pt-16 sm:px-10 sm:pt-20 lg:px-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 sm:col-span-3 lg:col-span-1"
          >
            <span className="font-display text-[19px] font-extrabold tracking-tight text-white">AQSTRA</span>
            <p className="mt-3 max-w-[220px] text-[13px] leading-[1.6] text-white/45">
              Precision lead intelligence for modern sales teams.
            </p>
          </motion.div>

          {FOOTER_COLUMNS.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * (i + 1) }}
            >
              <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/45">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-white/70 transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12.5px] text-white/40">© {year} MetaMaster. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-[12.5px] text-white/40 transition-colors hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[12.5px] text-white/40 transition-colors hover:text-white/70">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* giant cursor-reactive brand mark */}
      <div className="hidden h-[16rem] sm:h-[20rem] lg:flex lg:h-[22rem]">
        <TextHoverEffect text="AQSTRA" duration={0.3} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "radial-gradient(125% 125% at 50% 100%, transparent 40%, rgba(37,99,235,.12) 100%)" }}
      />
    </footer>
  );
}
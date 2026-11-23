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
//             <span className="font-display text-[19px] font-extrabold tracking-tight text-white">Aqstra</span>
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
//         <TextHoverEffect text="Aqstra" duration={0.3} />
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
            <img src="/logo-3.png" alt="Aqstra" className="h-14 w-auto object-contain" />
            <p className="mt-3 max-w-[220px] text-[13px] leading-[1.6] text-white/45">
              Precision lead intelligence for modern sales teams.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <Link
                href="#"
                aria-label="Facebook"
                className="text-[#1877F2] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.099 4.388 23.094 10.125 24v-8.438H7.078v-3.489h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.49 0-1.955.932-1.955 1.887v2.263h3.328l-.532 3.489h-2.796V24C19.612 23.094 24 18.099 24 12.073z" />
                </svg>
              </Link>

              <Link
                href="https://www.instagram.com/aqstra.ai?dmpr=dmgxbGN4OXRqdTVu"
                aria-label="Instagram"
                className="transition-transform duration-200 hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFDC80" />
                      <stop offset="0.25" stopColor="#FCAF45" />
                      <stop offset="0.5" stopColor="#F77737" />
                      <stop offset="0.75" stopColor="#C13584" />
                      <stop offset="1" stopColor="#405DE6" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#instagram-gradient)" strokeWidth="2.2" />
                  <circle cx="12" cy="12" r="4.2" stroke="url(#instagram-gradient)" strokeWidth="2.2" />
                  <circle cx="17.4" cy="6.6" r="1.25" fill="#C13584" />
                </svg>
              </Link>

              <Link
                href="https://www.linkedin.com/company/aqstra/posts/?feedView=all"
                aria-label="LinkedIn"
                className="text-[#0A66C2] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {FOOTER_COLUMNS.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * (i + 1) }}
            >
              <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/45">{col.title}</h2>
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
          <p className="text-[12.5px] text-white/40">© {year} Aqstra. All rights reserved.</p>
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
        <TextHoverEffect text="Aqstra" duration={0.3} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "radial-gradient(125% 125% at 50% 100%, transparent 40%, rgba(37,99,235,.12) 100%)" }}
      />
    </footer>
  );
}
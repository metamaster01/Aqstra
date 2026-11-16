"use client";

import { motion, type Variants } from "framer-motion";
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

type Audience = {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
};

const audiences: Audience[] = [
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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WhoIsAqstraFor() {
  return (
    <section
      aria-labelledby="who-is-aqstra-for"
      className="relative overflow-hidden bg-white py-20 sm:py-28"
    >
      {/* Soft background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-200/40 via-indigo-200/40 to-violet-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0B1B3F0d_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Who is AQSTRA for?
          </span> */}

          <h2
            id="who-is-aqstra-for"
            className="mt-6 text-3xl font-bold tracking-tight text-[#0B1B3F] sm:text-4xl lg:text-5xl"
          >
            Built for People Who Are Serious About Finding Their{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Next Opportunity.
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {audiences.map(({ title, description, link, icon: Icon }, i) => (
            <motion.li
              key={title}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative"
            >
              {/* Gradient border glow on hover */}
              <div
                aria-hidden
                className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_1px_2px_rgba(11,27,63,0.04)] transition-shadow duration-300 group-hover:border-transparent group-hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.25)]">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-300 transition-colors group-hover:text-indigo-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[#0B1B3F]">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">
                  {description}
                </p>

                <Link
                  href={link}
                  className="mt-6 flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                >
                  Learn more
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

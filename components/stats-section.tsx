// "use client";

// import { motion } from "framer-motion";
// import { Clock, RefreshCw, TrendingUp, Zap } from "lucide-react";
// import { StatCard } from "../providers/stat-card";

// const stats = [
//   {
//     icon: TrendingUp,
//     label: "Traffic Match",
    
//     value: 45,
//     suffix: "%",
//     description: "Identifying up to 45% companies from anonymous website traffic",
//   },
//   {
//     icon: Zap,
//     label: "Conversion Lift",
//     value: 75,
//     suffix: "%",
//     description: "Increasing MQL-to-SQL pipeline conversion rates across teams",
//   },
//   {
//     icon: RefreshCw,
//     label: "Cost Optimization",
//     value: 35,
//     suffix: "%",
//     description: "Reducing acquisition cost per verified qualified pipeline lead",
//   },
//   {
//     icon: Clock,
//     label: "Time-to-Value",
//     value: 4,
//     suffix: " min",
//     suffixColor: "primary" as const,
//     description: "From tracker script setup to your first identified in-market account",
//   },
// ];

// export function StatsSection() {
//   return (
//     <section className="relative overflow-hidden bg-[#0a0e1a] py-16 sm:py-20">
//       <div aria-hidden className="pointer-events-none absolute inset-0">
//         <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
//       </div>

//       <div className="relative mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-20">
//         <div className="mx-auto max-w-[640px] text-center">
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
//           >
//             Documented ROI
//           </motion.p>
//           <motion.h2
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.08 }}
//             className="mt-3 font-display text-[28px] font-bold leading-[1.25] text-white sm:text-[34px]"
//           >
//             500M+ leads generated. Proven to drive results
//           </motion.h2>
//         </div>

//         <div className="mt-11 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
//           {stats.map((s, i) => (
//             <StatCard key={s.label} index={i} {...s} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }







"use client";

import { motion } from "framer-motion";
import { Clock, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { StatCard } from "@/providers/stat-card";

const stats = [
  {
    icon: TrendingUp,
    label: "Traffic Match",
    value: 45,
    suffix: "%",
    description: "Identifying up to 45% companies from anonymous website traffic",
  },
  {
    icon: Zap,
    label: "Conversion Lift",
    value: 75,
    suffix: "%",
    description: "Increasing MQL-to-SQL pipeline conversion rates across teams",
  },
  {
    icon: RefreshCw,
    label: "Cost Optimization",
    value: 35,
    suffix: "%",
    description: "Reducing acquisition cost per verified qualified pipeline lead",
  },
  {
    icon: Clock,
    label: "Time-to-Value",
    value: 4,
    suffix: " min",
    suffixColor: "primary" as const,
    description: "From tracker script setup to your first identified in-market account",
  },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0e1a] py-16 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[640px] text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            Documented ROI
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 font-display text-[28px] font-bold leading-[1.25] text-white sm:text-[34px]"
          >
            500M+ leads generated. Proven to drive results
          </motion.h2>
        </div>

        <div className="mt-11 grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
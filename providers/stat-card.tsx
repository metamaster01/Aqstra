// "use client";

// import { motion } from "framer-motion";
// import type { LucideIcon } from "lucide-react";
// import { useCountUp } from "@/lib/use-count-up";

// interface StatCardProps {
//   icon: LucideIcon;
//   label: string;
//   value: number;
//   suffix: string;
//   suffixColor?: "primary" | "foreground";
//   description: string;
//   index: number;
// }

// export function StatCard({ icon: Icon, label, value, suffix, suffixColor = "primary", description, index }: StatCardProps) {
//   const { ref, rounded, inView } = useCountUp(value, { duration: 1.5 + index * 0.15 });

//   return (
//     <motion.div
//       ref={ref as React.RefObject<HTMLDivElement>}
//       initial={{ opacity: 0, y: 24 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-10% 0px" }}
//       transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
//       className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:p-6"
//     >
//       <div className="flex items-start justify-between">
//         <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45">{label}</p>
//         <motion.span
//           initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
//           animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
//           transition={{ duration: 0.5, delay: index * 0.1 + 0.3, ease: "backOut" }}
//           className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-primary"
//         >
//           <Icon className="size-3.5" strokeWidth={2.25} />
//         </motion.span>
//       </div>

//       <p className="mt-3 font-display text-[38px] font-extrabold leading-none text-white sm:text-[42px]">
//         <motion.span>{rounded}</motion.span>
//         <span className={suffixColor === "primary" ? "text-primary" : "text-white"}>{suffix}</span>
//       </p>

//       <p className="mt-3 max-w-[220px] text-[12.5px] leading-[1.6] text-white/45">{description}</p>
//     </motion.div>
//   );
// }






"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/lib/use-count-up";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix: string;
  suffixColor?: "primary" | "foreground";
  description: string;
  index: number;
}

export function StatCard({ icon: Icon, label, value, suffix, suffixColor = "primary", description, index }: StatCardProps) {
  const { ref, rounded, inView } = useCountUp(value, { duration: 1.5 + index * 0.15 });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:p-6"
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45">{label}</p>
        <motion.span
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3, ease: "backOut" }}
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-primary"
        >
          <Icon className="size-3.5" strokeWidth={2.25} />
        </motion.span>
      </div>

      {/* Number + label are the important part — kept visible at every size. */}
      <p className="mt-3 font-display text-[28px] font-extrabold leading-none text-white sm:text-[42px]">
        <motion.span>{rounded}</motion.span>
        <span className={suffixColor === "primary" ? "text-primary" : "text-white"}>{suffix}</span>
      </p>

      {/* Description is supporting detail only — hidden on mobile to save vertical space, unchanged from sm/desktop up. */}
      <p className="mt-3 hidden max-w-[220px] text-[12.5px] leading-[1.6] text-white/45 sm:block">{description}</p>
    </motion.div>
  );
}
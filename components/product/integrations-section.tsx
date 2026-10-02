"use client";

import { motion } from "framer-motion";
import { IntegrationsDiagram } from "./integrations-diagram";

/**
 * Same "colored letter badge" technique as the main diagram (and as
 * DataFlowSection) — lucide doesn't ship these brand glyphs. This list
 * drives the simple mobile/tablet fallback below `lg`; the full canvas
 * (IntegrationsDiagram) has its own copy since it needs fixed pixel
 * coordinates per node rather than a CSS grid.
 */
const INTEGRATIONS = [
  { name: "Salesforce", mark: "SF", bg: "#00A1E0" },
  { name: "HubSpot", mark: "H", bg: "#FF7A59" },
  { name: "Outreach", mark: "O", bg: "#0B8A6B" },
  { name: "SalesLoft", mark: "SL", bg: "#F6511D" },
  { name: "LinkedIn", mark: "in", bg: "#0A66C2" },
  { name: "Slack", mark: "S", bg: "#611F69" },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="scroll-mt-[90px] bg-background py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-[1200px] px-6 text-center sm:px-10 lg:px-20">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[26px] font-extrabold leading-[1.25] tracking-[-0.02em] sm:text-[32px]"
        >
          Integrates with your stack
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto mt-3 max-w-[440px] text-[14px] leading-[1.7] text-muted"
        >
          MetaMaster connects seamlessly with the tools your team already uses.
        </motion.p>

        {/* Desktop: full animated node diagram (AQSTRA → each platform) */}
        <div className="mt-4">
          <IntegrationsDiagram />
        </div>

        {/* Mobile / tablet: simple badge grid, no curves — same reasoning
            as DataFlowSection's MobileFlow: precise fan-out curves don't
            hold up at narrow widths, so this stays plain and readable. */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:hidden">
          {INTEGRATIONS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.45, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-6 shadow-sm transition-colors duration-300 hover:border-primary/40 hover:shadow-md"
            >
              <span
                className="flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: item.bg }}
              >
                {item.mark}
              </span>
              <span className="text-[13px] font-medium text-foreground/85">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  AdvancedSearchGlyph,
  CampaignBuilderGlyph,
  CrmSyncGlyph,
  DataEnrichmentGlyph,
  ListManagementGlyph,
  VerificationGlyph,
} from "./capability-icons";

const CAPABILITIES = [
  { icon: AdvancedSearchGlyph, title: "Advanced Search", desc: "Multi-criteria search with boolean logic, saved searches, and real-time results." },
  { icon: DataEnrichmentGlyph, title: "Data Enrichment", desc: "Automatically append firmographic, technographic, and contact data to your prospects." },
  { icon: VerificationGlyph, title: "Verification", desc: "Email and phone verification ensures your outreach reaches real people." },
  { icon: ListManagementGlyph, title: "List Management", desc: "Organize prospects into lists, share with team members, and track progress." },
  { icon: CampaignBuilderGlyph, title: "Campaign Builder", desc: "Create multi-touch outreach sequences with email, call, and task triggers." },
  { icon: CrmSyncGlyph, title: "CRM Sync", desc: "Two-way sync with Salesforce, HubSpot, and other major CRMs." },
];

export function PlatformCapabilitiesSection() {
  return (
    <section className="bg-[#0a0e1a] py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[560px] text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[28px] font-bold leading-[1.25] tracking-[-0.02em] text-white sm:text-[34px]"
          >
            Platform capabilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-3 max-w-[460px] text-[13.5px] leading-[1.7] text-white/45"
          >
            Everything you need to transform raw prospect data into qualified, actionable leads.
          </motion.p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {CAPABILITIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-[#d4f57e]/30 hover:bg-white/[0.05] sm:p-5"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-[#d4f57e] text-[#2b3a0a] transition-transform duration-300 group-hover:scale-110 sm:size-11">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-3.5 text-[13.5px] font-bold text-white sm:text-[14.5px]">{c.title}</h3>
                <p className="mt-1.5 text-[11.5px] leading-[1.55] text-white/45 sm:text-[12.5px]">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

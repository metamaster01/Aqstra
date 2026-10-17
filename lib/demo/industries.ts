import { hashString } from "./hash";

/** Safe for the browser: only ids and labels, no sample data. */
export const INDUSTRIES = [
  { id: "saas", label: "SaaS & Technology" },
  { id: "fintech", label: "Financial Technology" },
  { id: "healthtech", label: "Healthcare & Life Sciences" },
  { id: "ecommerce", label: "E-commerce & Retail" },
  { id: "edtech", label: "Education Technology" },
  { id: "logistics", label: "Logistics & Supply Chain" },
  { id: "manufacturing", label: "Manufacturing & Industrial" },
  { id: "martech", label: "Marketing & Advertising" },
  { id: "proptech", label: "Real Estate & PropTech" },
  { id: "climate", label: "Energy & Climate Tech" },
] as const;

export type IndustryId = (typeof INDUSTRIES)[number]["id"];

export const industryLabel = (id: string) => INDUSTRIES.find((i) => i.id === id)?.label ?? id;
export const isIndustry = (id: unknown): id is IndustryId => INDUSTRIES.some((i) => i.id === id);

/** The "organization domains identified" number on the analyzing screen. Same in browser and server. */
export const domainsScannedFor = (industryId: string) => 2800 + (hashString(`domains:${industryId}`) % 6200);

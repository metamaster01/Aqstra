/**
 * Turns (industry, target company) into masked sample results.
 * SERVER ONLY: it reads the unmasked sample dataset and masks emails here,
 * so nothing sensitive-looking ever reaches the browser.
 */
import { COMPANIES, LEADS } from "./dataset";
import { hashString, seededShuffle } from "./hash";
import { domainsScannedFor, industryLabel, isIndustry } from "./industries";
import type { DemoCompany, DemoLead, DemoSearchResult, SampleCompany } from "./types";

export const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  return `${local[0] ?? "x"}${"•".repeat(Math.min(7, Math.max(3, local.length - 1)))}@${domain}`;
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/** Letters, numbers, spaces and a few symbols only; trimmed and capped. */
export function cleanCompany(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[^\p{L}\p{N} &.,'’\-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 60);
}

const titleCase = (s: string) =>
  s === s.toLowerCase() ? s.replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;

/* ---- the visitor's own target company gets believable people too ---- */
const FIRST = ["Sarah", "Marcus", "Emily", "David", "Jennifer", "Alex", "Priya", "Daniel", "Aisha", "Rohan", "Mei", "Lucas"];
const LAST = ["Chen", "Rodriguez", "Watson", "Park", "Liu", "Thompson", "Iyer", "Carter", "Khan", "Nguyen", "Foster", "Reyes"];
const TARGET_ROLES = [
  "VP of Sales", "Chief Revenue Officer", "Head of Growth", "Director of Business Development",
  "VP of Marketing", "Head of Partnerships", "Chief Executive Officer",
];
const TARGET_COUNTRIES = ["United States", "India", "United Kingdom", "Singapore"];
const TARGET_SIZES = ["200–500", "500–1K", "1K–5K"];

function targetCompany(name: string): { company: SampleCompany; leads: { name: string; email: string; designation: string }[] } {
  const h = hashString(`target:${name.toLowerCase()}`);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18) || "company";
  const domain = `${slug}${[".com", ".io", ".ai"][h % 3]}`;
  const country = TARGET_COUNTRIES[h % TARGET_COUNTRIES.length];

  const used = new Set<string>();
  const leads = [0, 1].map((i) => {
    const hh = hashString(`target:${name.toLowerCase()}:${i}`);
    let first = FIRST[hh % FIRST.length];
    let last = LAST[(hh >>> 5) % LAST.length];
    for (let n = 1; used.has(`${first} ${last}`); n++) last = LAST[((hh >>> 5) + n) % LAST.length];
    used.add(`${first} ${last}`);
    return {
      name: `${first} ${last}`,
      email: `${first}.${last}@${domain}`.toLowerCase(),
      designation: TARGET_ROLES[(hh >>> 9) % TARGET_ROLES.length],
    };
  });
  // two different roles
  if (leads[0].designation === leads[1].designation) leads[1].designation = TARGET_ROLES[(TARGET_ROLES.indexOf(leads[0].designation) + 1) % TARGET_ROLES.length];

  return {
    company: {
      id: "target",
      name: titleCase(name),
      industry: "",
      domain,
      country,
      city: "",
      size: TARGET_SIZES[(h >>> 3) % TARGET_SIZES.length],
      fit: 94 + (h % 5),
      intent: "high",
    },
    leads,
  };
}

export function runDemoSearch(industryId: string, companyInput: string): Omit<DemoSearchResult, "searchesLeft"> | null {
  if (!isIndustry(industryId)) return null;
  const query = cleanCompany(companyInput);

  const pool = COMPANIES.filter((c) => c.industry === industryId);
  const seed = hashString(`${industryId}|${query.toLowerCase()}`);
  const picked = seededShuffle(pool, seed)
    .slice(0, query ? 5 : 6)
    .sort((a, b) => b.fit - a.fit);

  const companies: DemoCompany[] = [];
  const leads: DemoLead[] = [];

  const addLead = (l: { id: string; name: string; email: string; designation: string; decisionMaker: boolean; verified: boolean; intent: "high" | "medium" }, c: SampleCompany) =>
    leads.push({
      id: l.id,
      name: l.name,
      initials: initialsOf(l.name),
      tone: hashString(l.name) % 8,
      emailMasked: maskEmail(l.email),
      country: c.country,
      company: c.name,
      designation: l.designation,
      decisionMaker: l.decisionMaker,
      verified: l.verified,
      intent: l.intent,
    });

  if (query) {
    const t = targetCompany(query);
    companies.push({
      id: t.company.id, name: t.company.name, domain: t.company.domain, industry: industryLabel(industryId),
      size: t.company.size, location: t.company.country, fit: t.company.fit, intent: "high", contacts: t.leads.length, target: true,
    });
    t.leads.forEach((l, i) =>
      addLead(
        { id: `t-${i}`, ...l, decisionMaker: true, verified: i === 0 || seed % 3 !== 0, intent: i === 0 ? "high" : "medium" },
        t.company
      )
    );
  }

  for (const c of picked) {
    const people = LEADS.filter((l) => l.companyId === c.id).sort((a, b) => Number(b.decisionMaker) - Number(a.decisionMaker));
    companies.push({
      id: c.id, name: c.name, domain: c.domain, industry: industryLabel(industryId), size: c.size,
      location: `${c.city}, ${c.country}`, fit: c.fit, intent: c.intent, contacts: people.length, target: false,
    });
    people.forEach((l) => addLead(l, c));
  }

  return {
    industryLabel: industryLabel(industryId),
    query,
    domainsScanned: domainsScannedFor(industryId),
    companies,
    leads,
  };
}

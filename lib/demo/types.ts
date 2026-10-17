export type Intent = "high" | "medium";

/* ---- stored sample data (server only; emails are real-looking and unmasked) ---- */
export type SampleCompany = {
  id: string;
  name: string;
  industry: string;
  domain: string;
  country: string;
  city: string;
  size: string;
  fit: number;
  intent: Intent;
};
export type SampleLead = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  designation: string;
  decisionMaker: boolean;
  verified: boolean;
  intent: Intent;
};

/* ---- what the browser receives: NEVER contains a real email ---- */
export type DemoLead = {
  id: string;
  name: string;
  initials: string;
  tone: number; // 0-7, picks the avatar color
  emailMasked: string;
  country: string;
  company: string;
  designation: string;
  decisionMaker: boolean;
  verified: boolean;
  intent: Intent;
};

export type DemoCompany = {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  fit: number;
  intent: Intent;
  contacts: number;
  target: boolean; // the company the visitor typed in
};

export type DemoSearchResult = {
  industryLabel: string;
  query: string;
  domainsScanned: number;
  companies: DemoCompany[];
  leads: DemoLead[];
  searchesLeft: number;
};

export type DemoEventType = "unlock_click" | "book_demo_click" | "login_click" | "plans_click" | "view_companies";

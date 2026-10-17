export const DEMO_COOKIE = "aq_demo";
export const SESSION_DAYS = 7;
export const MAX_SEARCHES = 12; // per demo request, to keep the demo a demo
export const PAGE_SIZE = 8;

export const GOALS = [
  "Find new customers (outbound prospecting)",
  "Build better, more targeted lead lists",
  "Qualify and score inbound leads",
  "Improve outreach and reply rates",
  "Clean and enrich CRM data",
  "Something else",
] as const;

export const EVENT_TYPES = ["unlock_click", "book_demo_click", "login_click", "plans_click", "view_companies"] as const;

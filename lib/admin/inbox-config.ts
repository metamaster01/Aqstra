export const INBOX_PAGE_SIZE = 20;

export const MESSAGE_STATUSES = [
  { value: "new", label: "New" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
] as const;

export const DEMO_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
] as const;

export type MessageStatus = (typeof MESSAGE_STATUSES)[number]["value"];
export type DemoStatus = (typeof DEMO_STATUSES)[number]["value"];

export const STATUS_TONE: Record<string, "info" | "success" | "warning" | "neutral"> = {
  new: "info",
  replied: "success",
  archived: "neutral",
  contacted: "warning",
  qualified: "success",
  closed: "neutral",
};

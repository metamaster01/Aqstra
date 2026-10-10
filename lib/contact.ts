/**
 * Contact page config, form options and validation. The same validateContact()
 * runs in the browser (instant feedback) and in /api/contact (the real check).
 */
import { LEGAL } from "@/lib/legal";

export const CONTACT = {
  salesEmail: "sales@aqstra.com", // TODO: confirm real address
  supportEmail: LEGAL.supportEmail,
  responseTime: "within one business day",
} as const;

/** Image beside the form. Drop the file in /public/images/contact/ (about 1200×900). */
export const CONTACT_IMAGE = {
  src: "/contact-team.jpg",
  alt: "The AQSTRA team",
  width: 1200,
  height: 900,
};

export const TOPICS = [
  { value: "demo", label: "Book a demo" },
  { value: "sales", label: "Talk to sales" },
  { value: "support", label: "Product support" },
  { value: "partnership", label: "Partnerships" },
  { value: "other", label: "Something else" },
] as const;
export type TopicValue = (typeof TOPICS)[number]["value"];

export const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"] as const;

export const NEXT_STEPS = [
  {
    title: "We read your message",
    text: "A person on our team reviews every request and routes it to the right place.",
  },
  {
    title: "You get a reply",
    text: `Usually ${CONTACT.responseTime}, with answers or a suggested time to talk.`,
  },
  {
    title: "A walkthrough that fits",
    text: "If you asked for a demo, we show AQSTRA on your own use case, not a generic tour.",
  },
];

export const CONTACT_FAQS = [
  {
    q: "What should I include in my message?",
    a: "Tell us about your team, the lead sources you use today and what you want to improve. The more context you give, the more useful our reply will be.",
  },
  {
    q: "How quickly will I hear back?",
    a: `We aim to reply ${CONTACT.responseTime}. Messages sent over a weekend are answered the next working day.`,
  },
  {
    q: "Where can I get help with the product?",
    a: "Setup guides and how-tos are in the Documentation. For anything else, choose Product support in the form.",
  },
  {
    q: "What happens to the details I send?",
    a: "We use them only to respond to your request. You can read how we handle personal data in our Privacy Policy.",
  },
];

/* -------------------------------- Validation ------------------------------- */

export type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  companySize: string;
  topic: TopicValue;
  message: string;
  consent: boolean;
};
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d][\d\s().-]{5,19}$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateContact(
  raw: Partial<Record<keyof ContactInput, unknown>>
): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const data: ContactInput = {
    firstName: str(raw.firstName),
    lastName: str(raw.lastName),
    email: str(raw.email),
    company: str(raw.company),
    phone: str(raw.phone),
    companySize: str(raw.companySize),
    topic: str(raw.topic) as TopicValue,
    message: str(raw.message),
    consent: raw.consent === true,
  };

  const errors: ContactErrors = {};
  if (!data.firstName) errors.firstName = "Please enter your first name.";
  else if (data.firstName.length > 60) errors.firstName = "That name is too long.";
  if (!data.lastName) errors.lastName = "Please enter your last name.";
  else if (data.lastName.length > 60) errors.lastName = "That name is too long.";
  if (!data.email) errors.email = "Please enter your work email.";
  else if (data.email.length > 254 || !EMAIL.test(data.email)) errors.email = "That email address doesn't look right.";
  if (!data.company) errors.company = "Please enter your company.";
  else if (data.company.length > 120) errors.company = "That name is too long.";
  if (data.phone && !PHONE.test(data.phone)) errors.phone = "Please enter a valid phone number, or leave it blank.";
  if (data.companySize && !(COMPANY_SIZES as readonly string[]).includes(data.companySize)) {
    errors.companySize = "Please choose one of the options.";
  }
  if (!TOPICS.some((t) => t.value === data.topic)) errors.topic = "Please choose a topic.";
  if (data.message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  else if (data.message.length > 2000) errors.message = "Please keep your message under 2,000 characters.";
  if (!data.consent) errors.consent = "Please confirm to continue.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

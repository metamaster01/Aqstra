/** Demo-request form: types and validation, shared by the browser and the API. */
import { GOALS } from "./config";

export type DemoRequestInput = {
  fullName: string;
  email: string;
  phone: string; // optional
  goal: string; // optional
  consent: boolean;
};
export type DemoRequestErrors = Partial<Record<keyof DemoRequestInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d][\d\s().-]{5,19}$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Personal inboxes: not accepted, because the demo is for business email addresses. */
const PERSONAL = [
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk", "yahoo.fr", "yahoo.de", "yahoo.ca", "ymail.com", "rocketmail.com",
  "outlook.com", "outlook.in", "hotmail.com", "hotmail.co.uk", "live.com", "live.in", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "proton.me", "protonmail.com", "pm.me", "tutanota.com", "tuta.io",
  "gmx.com", "gmx.net", "gmx.de", "web.de", "mail.com", "zoho.com", "yandex.com", "yandex.ru",
  "rediffmail.com", "inbox.com", "fastmail.com", "hey.com", "qq.com", "163.com", "naver.com",
];

/** Throwaway inboxes (they'd defeat the point of asking for an email). */
const DISPOSABLE = [
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com", "temp-mail.org", "yopmail.com",
  "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com", "maildrop.cc", "throwawaymail.com",
];

const matches = (domain: string, list: string[]) => list.some((d) => domain === d || domain.endsWith(`.${d}`));

export const emailDomain = (email: string) => email.split("@")[1]?.toLowerCase() ?? "";

/** null when the address is acceptable, otherwise the message to show. */
export function emailProblem(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (!email) return "Please enter your work email.";
  if (email.length > 254 || !EMAIL.test(email)) return "That email address doesn't look right.";
  const domain = emailDomain(email);
  if (matches(domain, PERSONAL)) return "Please use your work email. Personal addresses like Gmail or Yahoo aren't accepted for the demo.";
  if (matches(domain, DISPOSABLE)) return "Please use your work email. Temporary addresses aren't accepted.";
  return null;
}

export function validateDemoRequest(
  raw: Partial<Record<keyof DemoRequestInput, unknown>>
): { ok: true; data: DemoRequestInput } | { ok: false; errors: DemoRequestErrors } {
  const data: DemoRequestInput = {
    fullName: str(raw.fullName),
    email: str(raw.email).toLowerCase(),
    phone: str(raw.phone),
    goal: str(raw.goal),
    consent: raw.consent === true,
  };

  const errors: DemoRequestErrors = {};
  if (data.fullName.length < 2) errors.fullName = "Please enter your full name.";
  else if (data.fullName.length > 100) errors.fullName = "That name is too long.";

  const emailError = emailProblem(data.email);
  if (emailError) errors.email = emailError;

  if (data.phone && !PHONE.test(data.phone)) errors.phone = "Please enter a valid phone number, or leave it blank.";
  if (data.goal && !(GOALS as readonly string[]).includes(data.goal)) errors.goal = "Please choose one of the options.";
  if (!data.consent) errors.consent = "Please accept to continue.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

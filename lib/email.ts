/**
 * Transactional email via Resend's REST API (plain fetch, no SDK, so it runs
 * fine on Cloudflare Workers). Server-only: import from route handlers.
 *
 * Env (set as RUNTIME variables/secrets, not NEXT_PUBLIC_):
 *   RESEND_API_KEY        re_...
 *   CONTACT_FROM_EMAIL    "AQSTRA <hello@aqstra.com>"  (domain must be verified in Resend)
 *   CONTACT_NOTIFY_EMAIL  who gets new-request alerts; comma-separate for several
 */
import { CONTACT, TOPICS, type ContactInput } from "@/lib/contact";
import { LEGAL } from "@/lib/legal";

const RESEND_URL = "https://api.resend.com/emails";
const SITE = `https://${LEGAL.website}`;

const fromAddress = () => process.env.CONTACT_FROM_EMAIL || "AQSTRA <onboarding@resend.dev>";
const notifyAddresses = () =>
  (process.env.CONTACT_NOTIFY_EMAIL || CONTACT.salesEmail)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/* --------------------------------- helpers -------------------------------- */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string, max = 150) => s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
const topicLabel = (v: string) => TOPICS.find((t) => t.value === v)?.label ?? v;

async function sendEmail(args: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("email skipped: RESEND_API_KEY is not set");
    return false;
  }
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(args.idempotencyKey ? { "Idempotency-Key": args.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
        ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("resend rejected email", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("resend request failed", err);
    return false;
  }
}

/* -------------------------------- templates ------------------------------- */

function shell(preheader: string, inner: string) {
  return `<!doctype html><html lang="en"><body style="margin:0;padding:24px 12px;background:#f3f6fb;font-family:Inter,Arial,Helvetica,sans-serif;color:#0f172a;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;">
<tr><td style="padding:20px 28px;border-bottom:1px solid #e2e8f0;font-size:18px;font-weight:800;letter-spacing:-0.02em;">AQSTRA</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.65;">${inner}</td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.6;color:#64748b;">${LEGAL.company} &middot; ${esc(LEGAL.website)}</p>
</td></tr></table></body></html>`;
}

const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 16px 6px 0;color:#64748b;font-size:13px;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;font-size:14px;">${value}</td></tr>`;

const messageBox = (msg: string) =>
  `<div style="margin-top:6px;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;white-space:pre-wrap;word-break:break-word;">${esc(msg)}</div>`;

function adminEmail(d: ContactInput, submittedAt: Date) {
  const name = `${d.firstName} ${d.lastName}`;
  const subject = oneLine(`New ${topicLabel(d.topic)} request: ${name} (${d.company})`);
  const when = submittedAt.toUTCString();

  const html = shell(
    `${name} from ${d.company} sent a ${topicLabel(d.topic).toLowerCase()} request`,
    `<h1 style="margin:0 0 4px;font-size:20px;letter-spacing:-0.02em;">New contact request</h1>
<p style="margin:0 0 18px;color:#64748b;font-size:13px;">Reply to this email to respond to ${esc(d.firstName)} directly.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
${row("Topic", `<strong>${esc(topicLabel(d.topic))}</strong>`)}
${row("Name", esc(name))}
${row("Email", `<a href="mailto:${esc(d.email)}" style="color:#2563eb;">${esc(d.email)}</a>`)}
${d.phone ? row("Phone", `<a href="tel:${esc(d.phone)}" style="color:#2563eb;">${esc(d.phone)}</a>`) : ""}
${row("Company", esc(d.company))}
${d.companySize ? row("Company size", esc(d.companySize)) : ""}
${row("Received", esc(when))}
</table>
<p style="margin:20px 0 0;font-size:13px;color:#64748b;">Message</p>
${messageBox(d.message)}`
  );

  const text = [
    `New contact request`,
    ``,
    `Topic: ${topicLabel(d.topic)}`,
    `Name: ${name}`,
    `Email: ${d.email}`,
    d.phone ? `Phone: ${d.phone}` : "",
    `Company: ${d.company}`,
    d.companySize ? `Company size: ${d.companySize}` : "",
    `Received: ${when}`,
    ``,
    `Message:`,
    d.message,
    ``,
    `Reply to this email to respond directly.`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  return { subject, html, text };
}

function confirmationEmail(d: ContactInput) {
  const subject = "We've received your message";
  const preview = d.message.length > 600 ? `${d.message.slice(0, 600)}…` : d.message;

  const html = shell(
    `Thanks ${d.firstName}, our team will get back to you soon.`,
    `<h1 style="margin:0 0 12px;font-size:22px;letter-spacing:-0.02em;">Thanks, ${esc(d.firstName)}. We've got your message.</h1>
<p style="margin:0 0 14px;">A member of our team will review it and get back to you soon, usually ${esc(CONTACT.responseTime)}.${
      d.phone ? ` If it's easier, we may call you on ${esc(d.phone)}.` : ""
    }</p>
<p style="margin:18px 0 0;font-size:13px;color:#64748b;">Here is what you sent (${esc(topicLabel(d.topic))})</p>
${messageBox(preview)}
<p style="margin:22px 0 8px;">While you wait, you might find these useful:</p>
<p style="margin:0;"><a href="${SITE}/docs" style="color:#2563eb;">Documentation</a> &nbsp;&middot;&nbsp; <a href="${SITE}/resources" style="color:#2563eb;">Guides and insights</a></p>
<p style="margin:24px 0 0;font-size:12.5px;color:#64748b;">You're receiving this because this address was used on our contact form. If that wasn't you, you can safely ignore this email.</p>`
  );

  const text = [
    `Thanks, ${d.firstName}. We've got your message.`,
    ``,
    `A member of our team will review it and get back to you soon, usually ${CONTACT.responseTime}.`,
    d.phone ? `If it's easier, we may call you on ${d.phone}.` : "",
    ``,
    `What you sent (${topicLabel(d.topic)}):`,
    preview,
    ``,
    `Documentation: ${SITE}/docs`,
    `Guides and insights: ${SITE}/resources`,
    ``,
    `If this wasn't you, you can ignore this email.`,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  return { subject, html, text };
}

/* --------------------------------- public --------------------------------- */

/**
 * Sends the team alert (Reply-To = the visitor) and, unless skipped, a
 * confirmation to the visitor (Reply-To = your support inbox). Never throws;
 * returns what actually went out so the caller can record it.
 */
export async function sendContactEmails(
  d: ContactInput,
  opts: { id: string; sendConfirmation: boolean }
): Promise<{ admin: boolean; confirmation: boolean }> {
  const admin = adminEmail(d, new Date());
  const confirm = confirmationEmail(d);

  const [adminOk, confirmOk] = await Promise.all([
    sendEmail({
      to: notifyAddresses(),
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      replyTo: d.email,
      idempotencyKey: `contact-admin-${opts.id}`,
    }),
    opts.sendConfirmation
      ? sendEmail({
          to: d.email,
          subject: confirm.subject,
          html: confirm.html,
          text: confirm.text,
          replyTo: CONTACT.supportEmail,
          idempotencyKey: `contact-confirm-${opts.id}`,
        })
      : Promise.resolve(false),
  ]);

  return { admin: adminOk, confirmation: confirmOk };
}

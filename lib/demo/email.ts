import { CONTACT } from "@/lib/contact";
import { esc, messageBox, notifyAddresses, oneLine, row, sendEmail, shell } from "@/lib/email";
import { SESSION_DAYS } from "./config";
import { emailDomain, type DemoRequestInput } from "./request";

type Args = {
  requestId: string;
  data: DemoRequestInput;
  link: string; // magic link back into the demo
  origin: string;
  sendConfirmation: boolean;
};

function adminEmail({ data: d }: Args) {
  const domain = emailDomain(d.email);
  const subject = oneLine(`New demo request: ${d.fullName} (${domain})`);
  const html = shell(
    `${d.fullName} (${domain}) requested a demo`,
    `<h1 style="margin:0 0 4px;font-size:20px;letter-spacing:-0.02em;">New demo request</h1>
<p style="margin:0 0 18px;color:#64748b;font-size:13px;">Reply to this email to reach ${esc(d.fullName.split(" ")[0])} directly.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
${row("Name", esc(d.fullName))}
${row("Work email", `<a href="mailto:${esc(d.email)}" style="color:#2563eb;">${esc(d.email)}</a>`)}
${row("Company (from email)", esc(domain))}
${d.phone ? row("Phone", `<a href="tel:${esc(d.phone)}" style="color:#2563eb;">${esc(d.phone)}</a>`) : ""}
</table>
${d.goal ? `<p style="margin:20px 0 0;font-size:13px;color:#64748b;">Main goal</p>${messageBox(d.goal)}` : ""}
<p style="margin:18px 0 0;font-size:12.5px;color:#64748b;">They were sent to the interactive demo. Their searches are saved against this request in Supabase (demo_searches).</p>`
  );
  const text = [
    "New demo request", "",
    `Name: ${d.fullName}`, `Work email: ${d.email}`, `Company (from email): ${domain}`,
    d.phone ? `Phone: ${d.phone}` : "", d.goal ? `Main goal: ${d.goal}` : "", "",
    "Reply to this email to reach them directly.",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  return { subject, html, text };
}

function confirmationEmail({ data: d, link }: Args) {
  const first = d.fullName.split(" ")[0];
  const subject = "Your AQSTRA demo is ready";
  const html = shell(
    `${first}, your interactive AQSTRA demo is ready.`,
    `<h1 style="margin:0 0 12px;font-size:22px;letter-spacing:-0.02em;">Your demo is ready, ${esc(first)}.</h1>
<p style="margin:0 0 18px;">Thanks for requesting a demo. Pick an industry and a target company and see how AQSTRA finds and qualifies prospects. It takes about two minutes and needs no login.</p>
<p style="margin:0 0 22px;"><a href="${esc(link)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px;">Open your demo</a></p>
<p style="margin:0 0 6px;font-size:13px;color:#64748b;">This personal link works for ${SESSION_DAYS} days.</p>
<p style="margin:18px 0 0;">Someone from our team will also be in touch ${esc(CONTACT.responseTime)} to learn about your goals and show you what live results look like for your market.${
      d.phone ? ` We have your number (${esc(d.phone)}) and may call to arrange a time.` : ""
    }</p>
<p style="margin:24px 0 0;font-size:12.5px;color:#64748b;">You're receiving this because this address was used to request a demo. If that wasn't you, you can safely ignore this email.</p>`
  );
  const text = [
    `Your demo is ready, ${first}.`, "",
    "Pick an industry and a target company and see how AQSTRA finds and qualifies prospects.",
    `Open your demo: ${link}`, `(This personal link works for ${SESSION_DAYS} days.)`, "",
    `Someone from our team will be in touch ${CONTACT.responseTime}.${d.phone ? ` We have your number (${d.phone}) and may call to arrange a time.` : ""}`, "",
    "If this wasn't you, you can ignore this email.",
  ].join("\n");
  return { subject, html, text };
}

/** Never throws. Returns what actually went out so the caller can record it. */
export async function sendDemoEmails(args: Args): Promise<{ admin: boolean; confirmation: boolean }> {
  const admin = adminEmail(args);
  const confirm = confirmationEmail(args);

  const [adminOk, confirmOk] = await Promise.all([
    sendEmail({
      to: notifyAddresses(),
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      replyTo: args.data.email,
      idempotencyKey: `demo-admin-${args.requestId}`,
    }),
    args.sendConfirmation
      ? sendEmail({
          to: args.data.email,
          subject: confirm.subject,
          html: confirm.html,
          text: confirm.text,
          replyTo: CONTACT.supportEmail,
          idempotencyKey: `demo-confirm-${args.requestId}`,
        })
      : Promise.resolve(false),
  ]);
  return { admin: adminOk, confirmation: confirmOk };
}

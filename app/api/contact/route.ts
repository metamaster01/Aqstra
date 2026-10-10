import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateContact } from "@/lib/contact";
import { sendContactEmails } from "@/lib/email";

/**
 * POST /api/contact
 *  1. validates, 2. saves to Supabase (the source of truth),
 *  3. emails your team + sends the visitor a confirmation (via Resend).
 * Emails can fail without losing the message: it is already saved, and the
 * admin_notified / confirmation_sent columns record what actually went out.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Cheap bot checks: a hidden field humans never fill, and a form submitted
  // faster than a person could. Reply "ok" so bots learn nothing.
  const tooFast = typeof body.startedAt === "number" && Date.now() - body.startedAt < 2000;
  if (body.website || tooFast) return NextResponse.json({ ok: true });

  const result = validateContact(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });

  const d = result.data;
  const email = d.email.toLowerCase();

  try {
    const db = supabaseAdmin();

    // The confirmation goes to whatever address was typed, so don't let one
    // address be hit repeatedly: skip it if this email wrote in the last 10 min.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await db
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since);
    const sendConfirmation = !count;

    const { data: row, error } = await db
      .from("contact_submissions")
      .insert({
        first_name: d.firstName,
        last_name: d.lastName,
        email,
        phone: d.phone || null,
        company: d.company,
        company_size: d.companySize || null,
        topic: d.topic,
        message: d.message,
        consent: d.consent,
        user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      })
      .select("id")
      .single();
    if (error || !row) throw error ?? new Error("insert returned no row");

    const sent = await sendContactEmails({ ...d, email }, { id: row.id, sendConfirmation });

    const { error: flagError } = await db
      .from("contact_submissions")
      .update({ admin_notified: sent.admin, confirmation_sent: sent.confirmation })
      .eq("id", row.id);
    if (flagError) console.error("could not record email status", flagError);

    return NextResponse.json({ ok: true, confirmation: sent.confirmation });
  } catch (err) {
    console.error("contact submit failed", err);
    return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 500 });
  }
}
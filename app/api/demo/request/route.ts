import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEMO_COOKIE } from "@/lib/demo/config";
import { sendDemoEmails } from "@/lib/demo/email";
import { validateDemoRequest } from "@/lib/demo/request";
import { cookieOptions, newToken, sessionExpiry, sha256 } from "@/lib/demo/session";

/**
 * POST /api/demo/request
 * Saves the lead, emails your team, emails the visitor a personal demo link,
 * and starts their demo session (httpOnly cookie).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Cheap bot checks (hidden field, and a form submitted faster than a person could).
  const tooFast = typeof body.startedAt === "number" && Date.now() - body.startedAt < 2500;
  if (body.website || tooFast) return NextResponse.json({ ok: true });

  const result = validateDemoRequest(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  const d = result.data;

  try {
    const db = supabaseAdmin();

    // The confirmation goes to whatever address was typed, so don't let one
    // address be emailed repeatedly: skip it if it asked in the last 10 minutes.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await db
      .from("demo_requests")
      .select("id", { count: "exact", head: true })
      .eq("email", d.email)
      .gte("created_at", since);
    const sendConfirmation = !count;

    const token = newToken();
    const expires = sessionExpiry();

    const { data: row, error } = await db
      .from("demo_requests")
      .insert({
        full_name: d.fullName,
        email: d.email,
        phone: d.phone || null,
        goal: d.goal || null,
        consent: d.consent,
        token_hash: await sha256(token),
        expires_at: expires.toISOString(),
        user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      })
      .select("id")
      .single();
    if (error || !row) throw error ?? new Error("insert returned no row");

    const origin = new URL(req.url).origin;
    const sent = await sendDemoEmails({
      requestId: row.id,
      data: d,
      origin,
      link: `${origin}/demo/enter?t=${token}`,
      sendConfirmation,
    });

    const { error: flagError } = await db
      .from("demo_requests")
      .update({ admin_notified: sent.admin, confirmation_sent: sent.confirmation })
      .eq("id", row.id);
    if (flagError) console.error("could not record demo email status", flagError);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(DEMO_COOKIE, token, cookieOptions(expires));
    return res;
  } catch (err) {
    console.error("demo request failed", err);
    return NextResponse.json({ ok: false, error: "Could not start your demo. Please try again." }, { status: 500 });
  }
}

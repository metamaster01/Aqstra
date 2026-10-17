import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { MAX_SEARCHES } from "@/lib/demo/config";
import { isIndustry } from "@/lib/demo/industries";
import { cleanCompany, runDemoSearch } from "@/lib/demo/search";
import { getDemoSession } from "@/lib/demo/session";

/** POST /api/demo/search: runs one demo search for the signed-in demo visitor and records it. */
export async function POST(req: Request) {
  const session = await getDemoSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Your demo session has ended.", code: "session" }, { status: 401 });
  }

  let body: { industry?: unknown; company?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!isIndustry(body.industry)) {
    return NextResponse.json({ ok: false, error: "Please choose an industry." }, { status: 422 });
  }
  const company = cleanCompany(body.company);

  try {
    const db = supabaseAdmin();
    const { count } = await db
      .from("demo_searches")
      .select("id", { count: "exact", head: true })
      .eq("request_id", session.id);
    const used = count ?? 0;
    if (used >= MAX_SEARCHES) {
      return NextResponse.json(
        { ok: false, error: "You've used all your demo searches. Book a call and we'll show you live results.", code: "limit" },
        { status: 429 }
      );
    }

    const result = runDemoSearch(body.industry, company);
    if (!result) return NextResponse.json({ ok: false, error: "Please choose an industry." }, { status: 422 });

    await Promise.all([
      db.from("demo_searches").insert({
        request_id: session.id,
        industry: body.industry,
        company_query: company || null,
        leads_count: result.leads.length,
        companies_count: result.companies.length,
      }),
      db.from("demo_requests").update({ last_active_at: new Date().toISOString() }).eq("id", session.id),
    ]);

    return NextResponse.json({ ok: true, result: { ...result, searchesLeft: MAX_SEARCHES - used - 1 } });
  } catch (err) {
    console.error("demo search failed", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EVENT_TYPES } from "@/lib/demo/config";
import { getDemoSession } from "@/lib/demo/session";

/** POST /api/demo/event: records a buying signal (unlock click, "Book a demo" click, ...). */
export async function POST(req: Request) {
  const session = await getDemoSession();
  if (!session) return new NextResponse(null, { status: 204 });

  try {
    const body = (await req.json()) as { type?: unknown; meta?: unknown };
    if (!(EVENT_TYPES as readonly string[]).includes(String(body.type))) return new NextResponse(null, { status: 204 });

    // meta is free-form from the browser: keep only small flat string/number values.
    const meta: Record<string, string | number> = {};
    if (body.meta && typeof body.meta === "object") {
      for (const [k, v] of Object.entries(body.meta as Record<string, unknown>).slice(0, 5)) {
        if (typeof v === "string") meta[k.slice(0, 30)] = v.slice(0, 80);
        else if (typeof v === "number") meta[k.slice(0, 30)] = v;
      }
    }

    await supabaseAdmin().from("demo_events").insert({ request_id: session.id, type: body.type, meta });
  } catch (err) {
    console.error("demo event failed", err);
  }
  return new NextResponse(null, { status: 204 });
}

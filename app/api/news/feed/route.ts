import { NextResponse, type NextRequest } from "next/server";
import { getFeed, parseFeedParams } from "@/lib/news/server";

// Public, read-only, validated, and cached at the edge for 5 minutes.
export async function GET(req: NextRequest) {
  const args = parseFeedParams(req.nextUrl.searchParams);
  if (!args) return NextResponse.json({ error: "bad request" }, { status: 400 });
  try {
    const page = await getFeed(args);
    return NextResponse.json(page, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e) {
    console.error("[news] api error:", (e as Error).message);
    return NextResponse.json({ error: "unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE } from "@/lib/demo/config";
import { cookieOptions, findSessionByToken } from "@/lib/demo/session";

/** The link in the confirmation email: GET /demo/enter?t=<token> reopens the demo on any device. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t") ?? "";
  const session = await findSessionByToken(token);

  if (!session) {
    return NextResponse.redirect(new URL("/get-a-demo?expired=1", req.url));
  }

  const res = NextResponse.redirect(new URL("/demo", req.url));
  res.cookies.set(DEMO_COOKIE, token, cookieOptions(new Date(session.expiresAt)));
  return res;
}

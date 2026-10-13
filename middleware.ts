import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

/**
 * Runs ONLY for /admin/*. Two jobs:
 *   1. refresh the Supabase session cookie,
 *   2. send signed-out visitors to the login page before any admin page renders.
 *
 * This is the first lock, not the only one: every admin page and action also
 * calls requireAdmin(), and the database enforces the same rule with RLS.
 *
 * Next.js 16 renamed this file to proxy.ts (and the export to `proxy`). This
 * version works on 15 and 16 and on Cloudflare/OpenNext. If you move to
 * proxy.ts later, @opennextjs/cloudflare must be 1.20.3 or newer.
 */
export async function middleware(request: NextRequest) {
  const { response, signedIn } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!signedIn && pathname !== "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c)); // keep refreshed cookies
    return redirect;
  }

  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// New projects call this the "publishable" key; the legacy name is "anon". Either works.
export const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

/**
 * Cookie-aware client that acts AS THE SIGNED-IN USER, so Row Level Security
 * applies to everything it does. Use it in admin Server Components, Server
 * Actions and Route Handlers. (Public pages keep using lib/supabase/server.ts.)
 */
export async function createAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, which cannot write cookies.
          // Safe to ignore: middleware.ts refreshes the session on every /admin request.
        }
      },
    },
  });
}

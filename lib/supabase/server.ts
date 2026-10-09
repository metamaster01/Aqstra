import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client — used inside Server Components, route
 * handlers, and server actions. Still uses the anon key for now (all reads
 * are public/published content); swap to the service-role key only once
 * an authenticated admin write-path exists, and only inside server-only code.
 */
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

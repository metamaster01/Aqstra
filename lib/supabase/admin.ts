import { createClient } from "@supabase/supabase-js";

/**
 * Server-only client using the service-role key, which bypasses RLS. Use it
 * ONLY in route handlers / server actions, for writes the public must not make
 * directly (e.g. contact form submissions). Never import it in a "use client"
 * file, and never prefix the key with NEXT_PUBLIC_.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

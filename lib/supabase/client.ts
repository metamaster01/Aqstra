import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client. Safe to import into "use client" components —
 * uses the public anon key, which only has read access to published rows
 * (enforced by the RLS policies in supabase/schema.sql).
 */
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

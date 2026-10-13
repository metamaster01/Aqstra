"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { safeNext } from "@/lib/admin/auth";

export type LoginState = { error?: string };

// One message for every failure, so the form never reveals whether an email exists
// or whether a valid account simply lacks admin access.
const GENERIC = "Invalid email or password.";

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: GENERIC };

  // Authenticated is not enough: must also be on the admin allowlist.
  const { data: row } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!row) {
    await supabase.auth.signOut();
    return { error: GENERIC };
  }

  redirect(next);
}

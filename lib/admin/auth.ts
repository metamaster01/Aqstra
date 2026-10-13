import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";

export type AdminRole = "owner" | "editor";
export type Admin = { id: string; email: string; role: AdminRole };
export type AdminState =
  | { status: "anonymous" }
  | { status: "forbidden"; email: string } // signed in, but not on the allowlist
  | { status: "admin"; admin: Admin };

/** Who is making this request? Cached, so many calls in one request cost one lookup. */
export const getAdminState = cache(async (): Promise<AdminState> => {
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return { status: "anonymous" };

  const email = typeof claims.email === "string" ? claims.email : "";
  const { data: row } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (!row) return { status: "forbidden", email };
  return { status: "admin", admin: { id: claims.sub, email, role: row.role as AdminRole } };
});

/**
 * THE rule: call this first in every admin page, layout, Server Action and
 * Route Handler. Never assume the middleware already protected you.
 */
export async function requireAdmin(next?: string): Promise<Admin> {
  const state = await getAdminState();
  if (state.status === "anonymous") {
    redirect(next ? `/admin/login?next=${encodeURIComponent(next)}` : "/admin/login");
  }
  if (state.status === "forbidden") redirect("/admin/no-access");
  return state.admin;
}

/** For owner-only areas (team management). Editors get a 404, not a hint the page exists. */
export async function requireOwner(): Promise<Admin> {
  const admin = await requireAdmin();
  if (admin.role !== "owner") notFound();
  return admin;
}

/** Only ever redirect to a page inside /admin (blocks open-redirect tricks). */
export function safeNext(raw?: string | null): string {
  if (!raw) return "/admin";
  const inAdmin = raw === "/admin" || raw.startsWith("/admin/");
  if (!inAdmin || raw.startsWith("//") || raw.includes("\\")) return "/admin";
  if (raw.startsWith("/admin/login") || raw.startsWith("/admin/no-access")) return "/admin";
  return raw;
}

/**
 * Demo access. Filling in the request form creates a row and a random token.
 * The browser keeps the token in an httpOnly cookie; the database keeps only
 * its SHA-256 hash, so a leaked table can't be used to open anyone's demo.
 * Server only.
 */
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEMO_COOKIE, SESSION_DAYS } from "./config";

export type DemoSession = {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  expiresAt: string;
};

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const sessionExpiry = () => new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

export const cookieOptions = (expires: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  expires,
});

export async function findSessionByToken(token: string): Promise<DemoSession | null> {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return null;
  const { data } = await supabaseAdmin()
    .from("demo_requests")
    .select("id, full_name, email, expires_at")
    .eq("token_hash", await sha256(token))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    fullName: data.full_name,
    firstName: String(data.full_name).split(" ")[0],
    email: data.email,
    expiresAt: data.expires_at,
  };
}

/** The visitor's demo session from their cookie, or null. */
export async function getDemoSession(): Promise<DemoSession | null> {
  const token = (await cookies()).get(DEMO_COOKIE)?.value;
  return token ? findSessionByToken(token) : null;
}

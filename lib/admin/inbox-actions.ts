"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { UUID } from "@/lib/admin/db";
import { DEMO_STATUSES, MESSAGE_STATUSES } from "@/lib/admin/inbox-config";
import { fail, ok, type ActionResult } from "@/lib/admin/result";

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

async function setStatus(
  table: "contact_submissions" | "demo_requests",
  allowed: readonly { value: string }[],
  fd: FormData,
  path: string
): Promise<ActionResult> {
  await requireAdmin();

  const id = text(fd.get("id"));
  const status = text(fd.get("status"));
  if (!UUID.test(id) || !allowed.some((s) => s.value === status)) return fail("Invalid request.");

  const supabase = await createAuthClient();
  const { data, error } = await supabase.from(table).update({ status }).eq("id", id).select("id").maybeSingle();
  if (error) return fail("Couldn't update the status.");
  if (!data) return fail("That entry no longer exists.");

  revalidatePath(path);
  revalidatePath("/admin", "layout"); // refreshes the sidebar badges and dashboard counts
  return ok("Status updated.");
}

export const setMessageStatus = async (fd: FormData) => setStatus("contact_submissions", MESSAGE_STATUSES, fd, "/admin/messages");
export const setDemoStatus = async (fd: FormData) => setStatus("demo_requests", DEMO_STATUSES, fd, "/admin/demo-requests");

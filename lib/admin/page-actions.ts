"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { UUID } from "@/lib/admin/db";
import { fail, ok, type ActionResult } from "@/lib/admin/result";
import { revalidatePublic } from "@/lib/admin/revalidate";

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

function refresh() {
  revalidatePath("/admin", "layout");
  revalidatePublic();
}

export async function setPublished(fd: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = text(fd.get("id"));
  const publish = text(fd.get("publish")) === "true";
  if (!UUID.test(id)) return fail("Invalid page.");

  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from("doc_pages")
    .update({ published: publish })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return fail("Could not update the page.");
  if (!data) return fail("That page no longer exists.");

  refresh();
  return ok(publish ? "Page published." : "Page moved to drafts.");
}

export async function deletePage(fd: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = text(fd.get("id"));
  if (!UUID.test(id)) return fail("Invalid page.");

  const supabase = await createAuthClient();
  const { error } = await supabase.from("doc_pages").delete().eq("id", id); // sections cascade
  if (error) return fail("Could not delete the page.");

  refresh();
  return ok("Page deleted.");
}

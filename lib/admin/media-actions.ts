"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { UUID } from "@/lib/admin/db";
import { fail, ok, type ActionResult } from "@/lib/admin/result";
import { slugify } from "@/lib/admin/slug";
import { deleteObject, headObject, presignPut, publicUrl } from "@/lib/admin/r2";
import {
  MEDIA_FOLDERS,
  MEDIA_RULES,
  formatBytes,
  kindOf,
  type MediaAsset,
  type MediaFolder,
  type MediaKind,
} from "@/lib/admin/media-config";

const PAGE_SIZE = 24;
const KEY_PATTERN = /^(docs|resources)\/(images|videos)\/\d{4}-\d{2}\/[a-z0-9._-]+$/;

const isFolder = (v: string): v is MediaFolder => (MEDIA_FOLDERS as readonly string[]).includes(v);

function mapAsset(r: any): MediaAsset {
  return {
    id: r.id,
    key: r.key,
    url: r.url,
    kind: r.kind,
    folder: r.folder,
    name: r.name,
    mime: r.mime,
    sizeBytes: Number(r.size_bytes),
    width: r.width,
    height: r.height,
    createdAt: r.created_at,
  };
}

/* --------------------------------- upload --------------------------------- */

export async function createUpload(input: {
  name: string;
  type: string;
  size: number;
  folder: string;
}): Promise<{ ok: true; key: string; uploadUrl: string; headers: Record<string, string> } | { ok: false; error: string }> {
  await requireAdmin();

  if (!isFolder(input.folder)) return { ok: false, error: "Unknown folder." };
  const kind = kindOf(input.type);
  if (!kind) return { ok: false, error: "Unsupported file type. Use JPG, PNG, WebP, GIF, AVIF, MP4 or WebM." };

  const rule = MEDIA_RULES[kind];
  if (!Number.isFinite(input.size) || input.size <= 0) return { ok: false, error: "That file looks empty." };
  if (input.size > rule.maxBytes) {
    return {
      ok: false,
      error: `${formatBytes(input.size)} is over the ${formatBytes(rule.maxBytes)} limit for ${kind}s. Compress it first.`,
    };
  }

  const ext = rule.types[input.type];
  const base = slugify(input.name.replace(/\.[^.]+$/, "")).slice(0, 40) || "file";
  const now = new Date();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const key = `${input.folder}/${kind}s/${month}/${base}-${id}.${ext}`;

  try {
    const { url, headers } = await presignPut(key, input.type);
    return { ok: true, key, uploadUrl: url, headers };
  } catch (err) {
    console.error("presign failed", err);
    return { ok: false, error: "Uploads aren't set up yet. Check the R2 settings." };
  }
}

export async function confirmUpload(input: {
  key: string;
  name: string;
  type: string;
  folder: string;
  width?: number;
  height?: number;
}): Promise<{ ok: true; asset: MediaAsset } | { ok: false; error: string }> {
  await requireAdmin();

  const kind: MediaKind | null = kindOf(input.type);
  if (!kind || !isFolder(input.folder) || !KEY_PATTERN.test(input.key) || !input.key.startsWith(`${input.folder}/${kind}s/`)) {
    return { ok: false, error: "Invalid upload." };
  }

  let head: Awaited<ReturnType<typeof headObject>>;
  try {
    head = await headObject(input.key);
  } catch (err) {
    console.error("head failed", err);
    return { ok: false, error: "Couldn't verify the upload. Try again." };
  }
  if (!head) return { ok: false, error: "The file didn't reach storage. Try again." };

  // Presigned uploads can't cap size themselves, so verify afterwards and clean up.
  if (head.size > MEDIA_RULES[kind].maxBytes || head.contentType.split(";")[0] !== input.type) {
    await deleteObject(input.key).catch(() => {});
    return { ok: false, error: "That file wasn't accepted and has been removed." };
  }

  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      key: input.key,
      url: publicUrl(input.key),
      kind,
      folder: input.folder,
      name: input.name.slice(0, 200),
      mime: input.type,
      size_bytes: head.size,
      width: input.width || null,
      height: input.height || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("media insert failed", error);
    await deleteObject(input.key).catch(() => {});
    return { ok: false, error: "Couldn't save the file details. Try again." };
  }

  revalidatePath("/admin/media");
  return { ok: true, asset: mapAsset(data) };
}

/* ---------------------------------- list ---------------------------------- */

export async function listMedia(input: {
  kind?: string;
  folder?: string;
  q?: string;
  page?: number;
}): Promise<{ ok: true; items: MediaAsset[]; total: number; pageSize: number } | { ok: false; error: string }> {
  await requireAdmin();
  const supabase = await createAuthClient();

  let query = supabase.from("media_assets").select("*", { count: "exact" });
  if (input.kind === "image" || input.kind === "video") query = query.eq("kind", input.kind);
  if (input.folder && isFolder(input.folder)) query = query.eq("folder", input.folder);
  const term = (input.q ?? "").replace(/[%,()*\\]/g, " ").trim();
  if (term) query = query.ilike("name", `%${term}%`);

  const page = Math.max(1, input.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return { ok: false, error: "Couldn't load the library." };
  return { ok: true, items: (data ?? []).map(mapAsset), total: count ?? 0, pageSize: PAGE_SIZE };
}

/* --------------------------------- delete --------------------------------- */

export async function deleteMedia(fd: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = String(fd.get("id") ?? "");
  if (!UUID.test(id)) return fail("Invalid file.");

  const supabase = await createAuthClient();
  const { data: asset } = await supabase.from("media_assets").select("id, key, url, name").eq("id", id).maybeSingle();
  if (!asset) return fail("That file no longer exists.");

  // Never delete something a page still shows: it would leave a broken image.
  const quoted = `"${asset.url.replace(/"/g, '\\"')}"`;
  const [covers, sections] = await Promise.all([
    supabase.from("doc_pages").select("title").eq("cover_image_url", asset.url),
    supabase
      .from("page_sections")
      .select("doc_pages(title)")
      .or(`content->>url.eq.${quoted},content->>poster.eq.${quoted}`),
  ]);

  const titles = new Set<string>();
  (covers.data ?? []).forEach((p: any) => titles.add(p.title));
  (sections.data ?? []).forEach((s: any) => {
    const page = Array.isArray(s.doc_pages) ? s.doc_pages[0] : s.doc_pages;
    if (page?.title) titles.add(page.title);
  });
  if (titles.size) {
    const list = [...titles].slice(0, 3).map((t) => `"${t}"`).join(", ");
    const more = titles.size > 3 ? ` and ${titles.size - 3} more` : "";
    return fail(`Still used by ${list}${more}. Remove it from those pages first.`);
  }

  try {
    await deleteObject(asset.key);
  } catch (err) {
    console.error("r2 delete failed", err);
    return fail("Couldn't remove the file from storage. Try again.");
  }
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) return fail("Removed from storage, but the record couldn't be deleted. Try again.");

  revalidatePath("/admin/media");
  return ok("File deleted.");
}

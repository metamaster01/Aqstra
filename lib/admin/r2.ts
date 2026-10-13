import { AwsClient } from "aws4fetch";
import { CACHE_CONTROL } from "./media-config";

/**
 * Talks to R2 over its S3-compatible API using short-lived signed URLs, so big
 * files go from the browser straight to R2 and never pass through the Worker.
 * Server-only (it holds the secret key).
 *
 * Runtime secrets (Cloudflare: Settings → Variables and Secrets, NOT build variables):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET (default aqstra-media)
 */

export const CDN_BASE = (process.env.NEXT_PUBLIC_CDN_URL || "https://media.aqstra.com").replace(/\/+$/, "");
export const publicUrl = (key: string) => `${CDN_BASE}/${key}`;

function setup() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET || "aqstra-media";
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 is not configured: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.");
  }
  const aws = new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" });
  const objectUrl = (key: string) =>
    `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
  return { aws, objectUrl };
}

/**
 * A link the browser can PUT one file to, valid for a few minutes. Content-Type
 * and Cache-Control are part of the signature, so the upload only works if the
 * browser sends exactly those values.
 */
export async function presignPut(key: string, contentType: string, expiresSeconds = 600) {
  const { aws, objectUrl } = setup();
  const url = new URL(objectUrl(key));
  url.searchParams.set("X-Amz-Expires", String(expiresSeconds));
  const headers = { "Content-Type": contentType, "Cache-Control": CACHE_CONTROL };
  const signed = await aws.sign(new Request(url, { method: "PUT", headers }), {
    aws: { signQuery: true, allHeaders: true },
  });
  return { url: signed.url, headers };
}

/** Size and type of an uploaded object, or null if it isn't there. */
export async function headObject(key: string): Promise<{ size: number; contentType: string } | null> {
  const { aws, objectUrl } = setup();
  const res = await aws.fetch(objectUrl(key), { method: "HEAD" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`R2 HEAD failed (${res.status})`);
  return {
    size: Number(res.headers.get("content-length") ?? 0),
    contentType: res.headers.get("content-type") ?? "",
  };
}

export async function deleteObject(key: string): Promise<void> {
  const { aws, objectUrl } = setup();
  const res = await aws.fetch(objectUrl(key), { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`R2 DELETE failed (${res.status})`);
}

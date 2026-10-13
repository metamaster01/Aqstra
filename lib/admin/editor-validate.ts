/**
 * Validation + cleaning for the page editor. The browser runs it for instant
 * feedback and the server runs it again before saving, so the database only
 * ever receives clean, known shapes.
 */
import { slugify } from "./slug";
import { ACCENT_OPTIONS, CALLOUT_VARIANTS, IMAGE_WIDTHS, RESOURCE_TYPE_OPTIONS } from "./editor-types";
import type { EditorArea, EditorPage, EditorSection } from "./editor-types";

export const LIMITS = {
  title: 140,
  description: 300,
  slug: 80,
  tag: 40,
  readTime: 30,
  sectionTitle: 120,
  body: 20000,
  callout: 2000,
  caption: 300,
  alt: 200,
  code: 20000,
  language: 30,
  listItems: 50,
  listItem: 400,
} as const;

function cdnHost(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_CDN_URL || "https://media.aqstra.com").host;
  } catch {
    return "media.aqstra.com";
  }
}

/**
 * Images are drawn with next/image, which only loads hosts we've allowed, so
 * they must be uploaded here (or already live on the media domain).
 */
export function checkUrl(url: string, kind: "image" | "other"): string | null {
  if (!url) return null;
  if (url.startsWith("/") && !url.startsWith("//")) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "Enter a valid URL.";
  }
  if (parsed.protocol !== "https:") return "The URL must start with https://";
  if (kind === "image" && parsed.host !== cdnHost()) {
    return `Images must be uploaded here, or already be on ${cdnHost()}.`;
  }
  return null;
}

export type FieldErrors = Record<string, string>;

export function validatePageMeta(p: EditorPage, area: EditorArea): FieldErrors {
  const e: FieldErrors = {};
  const title = p.title.trim();
  if (!title) e.title = "Add a title.";
  else if (title.length > LIMITS.title) e.title = `Keep the title under ${LIMITS.title} characters.`;

  const slug = slugify(p.slug);
  if (!slug) e.slug = "Add a URL slug.";
  else if (slug.length > LIMITS.slug) e.slug = `Keep the slug under ${LIMITS.slug} characters.`;

  if (p.description.trim().length > LIMITS.description) {
    e.description = `Keep the description under ${LIMITS.description} characters.`;
  }
  if (area === "docs" && !p.categoryId) e.categoryId = "Choose a sidebar group so the page appears in the docs menu.";

  if (area === "docs") {
    if (p.type !== "Doc") e.type = "Docs pages must have the Doc type.";
  } else if (!(RESOURCE_TYPE_OPTIONS as readonly string[]).includes(p.type)) {
    e.type = "Choose a type.";
  }

  if (p.tag.trim().length > LIMITS.tag) e.tag = `Keep the tag under ${LIMITS.tag} characters.`;
  if (p.readTime.trim().length > LIMITS.readTime) e.readTime = `Keep this under ${LIMITS.readTime} characters.`;
  if (!(ACCENT_OPTIONS as readonly string[]).includes(p.accent)) e.accent = "Choose a color.";
  if (p.featured && area === "docs") e.featured = "Only resources can be featured.";
  if (p.featured && p.featured !== "main" && p.featured !== "side") e.featured = "Invalid value.";

  const coverError = checkUrl(p.cover, "image");
  if (coverError) e.cover = coverError;

  if (p.orderIndex != null && (!Number.isInteger(p.orderIndex) || p.orderIndex < 0 || p.orderIndex > 9999)) {
    e.orderIndex = "Use a whole number from 0 to 9999.";
  }
  return e;
}

type Clean = { ok: true; title: string; content: Record<string, unknown> } | { ok: false; error: string };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Whitelists the fields each block type is allowed to store. */
export function sanitizeSection(s: Pick<EditorSection, "type" | "title" | "content">): Clean {
  const title = str(s.title);
  if (title.length > LIMITS.sectionTitle) return { ok: false, error: `Keep the heading under ${LIMITS.sectionTitle} characters.` };
  const c = (s.content ?? {}) as Record<string, unknown>;

  switch (s.type) {
    case "text": {
      const body = typeof c.body === "string" ? c.body.replace(/\r\n/g, "\n").trim() : "";
      if (!body) return { ok: false, error: "Write some text, or remove this section." };
      if (body.length > LIMITS.body) return { ok: false, error: `Keep the text under ${LIMITS.body.toLocaleString()} characters.` };
      return { ok: true, title, content: { body } };
    }
    case "image": {
      const url = str(c.url);
      if (!url) return { ok: false, error: "Choose an image." };
      const urlError = checkUrl(url, "image");
      if (urlError) return { ok: false, error: urlError };
      const alt = str(c.alt);
      const caption = str(c.caption);
      if (alt.length > LIMITS.alt) return { ok: false, error: `Keep the alt text under ${LIMITS.alt} characters.` };
      if (caption.length > LIMITS.caption) return { ok: false, error: `Keep the caption under ${LIMITS.caption} characters.` };
      const width = (IMAGE_WIDTHS as readonly string[]).includes(str(c.width)) ? str(c.width) : "full";
      return { ok: true, title, content: { url, width, ...(alt && { alt }), ...(caption && { caption }) } };
    }
    case "video": {
      const url = str(c.url);
      if (!url) return { ok: false, error: "Choose a video." };
      const poster = str(c.poster);
      const caption = str(c.caption);
      const urlError = checkUrl(url, "other") ?? (poster ? checkUrl(poster, "other") : null);
      if (urlError) return { ok: false, error: urlError };
      if (caption.length > LIMITS.caption) return { ok: false, error: `Keep the caption under ${LIMITS.caption} characters.` };
      return { ok: true, title, content: { url, ...(poster && { poster }), ...(caption && { caption }) } };
    }
    case "callout": {
      const body = str(c.body);
      if (!body) return { ok: false, error: "Write the callout text, or remove this section." };
      if (body.length > LIMITS.callout) return { ok: false, error: `Keep the callout under ${LIMITS.callout.toLocaleString()} characters.` };
      const variant = (CALLOUT_VARIANTS as readonly string[]).includes(str(c.variant)) ? str(c.variant) : "info";
      return { ok: true, title, content: { variant, body } };
    }
    case "code": {
      const code = typeof c.code === "string" ? c.code.replace(/\r\n/g, "\n").replace(/\s+$/, "") : "";
      if (!code.trim()) return { ok: false, error: "Add some code, or remove this section." };
      if (code.length > LIMITS.code) return { ok: false, error: `Keep the code under ${LIMITS.code.toLocaleString()} characters.` };
      const language = str(c.language).slice(0, LIMITS.language) || "text";
      return { ok: true, title, content: { language, code } };
    }
    case "list": {
      const items = (Array.isArray(c.items) ? c.items : []).map(str).filter(Boolean);
      if (items.length === 0) return { ok: false, error: "Add at least one item, or remove this section." };
      if (items.length > LIMITS.listItems) return { ok: false, error: `Use at most ${LIMITS.listItems} items.` };
      if (items.some((i) => i.length > LIMITS.listItem)) return { ok: false, error: `Keep each item under ${LIMITS.listItem} characters.` };
      return { ok: true, title, content: { items } };
    }
    default:
      return { ok: false, error: "Unknown section type." };
  }
}

/** Unique, URL-safe anchors for the table of contents ("setup", "setup-2", ...). */
export function buildAnchors(titles: string[]): (string | null)[] {
  const seen = new Map<string, number>();
  return titles.map((t) => {
    const base = slugify(t);
    if (!base) return null;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });
}

export function validateAll(page: EditorPage, sections: EditorSection[], area: EditorArea) {
  const pageErrors = validatePageMeta(page, area);
  const sectionErrors: Record<string, string> = {};
  for (const s of sections) {
    const r = sanitizeSection(s);
    if (!r.ok) sectionErrors[s.key] = r.error;
  }
  return { pageErrors, sectionErrors, count: Object.keys(pageErrors).length + Object.keys(sectionErrors).length };
}

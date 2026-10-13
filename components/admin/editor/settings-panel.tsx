"use client";

import { RefreshCw } from "lucide-react";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { MediaField } from "@/components/admin/media/media-field";
import { Badge, inputClass } from "@/components/admin/ui";
import { deletePage } from "@/lib/admin/page-actions";
import { ACCENT_OPTIONS, RESOURCE_TYPE_OPTIONS, type EditorArea, type EditorPage } from "@/lib/admin/editor-types";
import { LIMITS } from "@/lib/admin/editor-validate";
import { slugify } from "@/lib/admin/slug";
import { folderForArea } from "@/lib/admin/media-config";

const SWATCH: Record<string, string> = {
  navy: "bg-[#1c3b6b]",
  violet: "bg-[#3a3690]",
  teal: "bg-[#14566a]",
  slate: "bg-[#334155]",
};

/** Lets people type a slug naturally; the exact clean-up happens on blur and on the server. */
const looseSlug = (v: string) =>
  v
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, LIMITS.slug);

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[12px] leading-[1.6] text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-[12.5px] text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function SettingsPanel({
  area,
  page,
  errors,
  categories,
  onChange,
  onDeleted,
}: {
  area: EditorArea;
  page: EditorPage;
  errors: Record<string, string>;
  categories: { id: string; label: string }[];
  onChange: (patch: Partial<EditorPage>) => void;
  onDeleted: () => void;
}) {
  const isDocs = area === "docs";
  const urlPrefix = isDocs ? "/docs/" : "/resource/";

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5 dark:border-white/15 dark:bg-white/[0.03]">
      {/* Status */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold">Visibility</p>
          <p className="mt-0.5 text-[12px] text-muted">{page.published ? "Visible to visitors" : "Draft: only admins can see it"}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={page.published}
          aria-label="Published"
          onClick={() => onChange({ published: !page.published })}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            page.published ? "bg-emerald-500" : "bg-foreground/20"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
              page.published ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <hr className="border-border" />

      <Field id="slug" label="URL" error={errors.slug} hint={page.id ? "Changing this changes the page's public address." : undefined}>
        <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
          <span className="grid shrink-0 place-items-center border-r border-border bg-foreground/[0.04] px-2.5 text-[12.5px] text-muted">
            {urlPrefix}
          </span>
          <input
            id="slug"
            value={page.slug}
            onChange={(e) => onChange({ slug: looseSlug(e.target.value), slugTouched: true })}
            onBlur={() => onChange({ slug: slugify(page.slug) })}
            aria-invalid={errors.slug ? true : undefined}
            className="h-10 min-w-0 flex-1 bg-transparent px-3 font-mono text-[13px] outline-none"
          />
        </div>
        {page.slugTouched && (
          <button
            type="button"
            onClick={() => onChange({ slug: slugify(page.title), slugTouched: false })}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-muted transition-colors hover:text-foreground"
          >
            <RefreshCw className="size-3" aria-hidden /> Match the title
          </button>
        )}
      </Field>

      <Field
        id="categoryId"
        label={isDocs ? "Sidebar group" : "Topic"}
        error={errors.categoryId}
        hint={categories.length === 0 ? "No groups yet. Create one under Categories first." : undefined}
      >
        <select
          id="categoryId"
          value={page.categoryId}
          onChange={(e) => onChange({ categoryId: e.target.value })}
          aria-invalid={errors.categoryId ? true : undefined}
          className={inputClass}
        >
          <option value="">{isDocs ? "Choose a group…" : "None"}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      {isDocs ? (
        <Field
          id="orderIndex"
          label="Position in group"
          error={errors.orderIndex}
          hint="Lower numbers appear first. Leave empty to add to the end."
        >
          <input
            id="orderIndex"
            type="number"
            min={0}
            max={9999}
            value={page.orderIndex ?? ""}
            onChange={(e) => onChange({ orderIndex: e.target.value === "" ? null : Number(e.target.value) })}
            className={inputClass}
          />
        </Field>
      ) : (
        <>
          <Field id="type" label="Type" error={errors.type}>
            <select id="type" value={page.type} onChange={(e) => onChange({ type: e.target.value })} className={inputClass}>
              {RESOURCE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field id="tag" label="Tag" error={errors.tag} hint="Small badge on cards">
              <input id="tag" value={page.tag} maxLength={LIMITS.tag} onChange={(e) => onChange({ tag: e.target.value })} placeholder="STRATEGY" className={inputClass} />
            </Field>
            <Field id="readTime" label="Read time" error={errors.readTime}>
              <input id="readTime" value={page.readTime} maxLength={LIMITS.readTime} onChange={(e) => onChange({ readTime: e.target.value })} placeholder="7 min read" className={inputClass} />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold">Card color</legend>
            <div className="flex flex-wrap gap-2">
              {ACCENT_OPTIONS.map((a) => (
                <label key={a} className="cursor-pointer">
                  <input type="radio" name="accent" value={a} checked={page.accent === a} onChange={() => onChange({ accent: a })} className="peer sr-only" />
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[12.5px] font-semibold capitalize text-muted transition-colors hover:border-primary peer-checked:border-primary peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                    <span className={`size-3 rounded-full ${SWATCH[a]}`} aria-hidden />
                    {a}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-[12px] text-muted">Used when a card has no cover image.</p>
          </fieldset>

          <Field
            id="featured"
            label="Featured on the Resources page"
            error={errors.featured}
            hint="Main is the big card (only one; choosing it replaces the current one). Side shows beside it (up to two)."
          >
            <select id="featured" value={page.featured} onChange={(e) => onChange({ featured: e.target.value as EditorPage["featured"] })} className={inputClass}>
              <option value="">Not featured</option>
              <option value="main">Main</option>
              <option value="side">Side</option>
            </select>
          </Field>

          <MediaField
            label="Cover image"
            kind="image"
            folder={folderForArea(area)}
            value={page.cover}
            onChange={(url) => onChange({ cover: url })}
            error={errors.cover}
            aspect="aspect-[12/5]"
            hint="Shown on the featured card and in lists. Wide images (about 12:5) work best."
          />
        </>
      )}

      {page.id && (
        <>
          <hr className="border-border" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-red-600 dark:text-red-400">Delete page</p>
              <p className="mt-0.5 text-[12px] text-muted">Removes it and all its sections.</p>
            </div>
            <ConfirmAction
              action={deletePage}
              fields={{ id: page.id }}
              title="Delete this page?"
              message={`"${page.title || "Untitled"}" and all of its sections will be permanently deleted. This can't be undone.`}
              confirmLabel="Delete page"
              trigger={<Badge tone="danger">Delete</Badge>}
              triggerLabel="Delete page"
              triggerClassName="rounded-md px-1 py-0.5 text-[13px] font-semibold hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onDone={onDeleted}
            />
          </div>
        </>
      )}
    </div>
  );
}

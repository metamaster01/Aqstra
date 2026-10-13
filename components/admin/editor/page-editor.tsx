"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Eye, ExternalLink, Loader2, Pencil, Plus, Save, SlidersHorizontal, TriangleAlert, X } from "lucide-react";
import { SECTION_ICON, SectionCard } from "./section-card";
import { SettingsPanel } from "./settings-panel";
import { EditorPreview } from "./preview";
import { useUnsavedGuard } from "./use-unsaved-guard";
import { useToast } from "@/components/admin/toast";
import { Badge, btn, inputClass } from "@/components/admin/ui";
import { savePage } from "@/lib/admin/editor-actions";
import {
  SECTION_HINT,
  SECTION_LABEL,
  newKey,
  newSection,
  type EditorArea,
  type EditorData,
  type EditorPage,
  type EditorSection,
} from "@/lib/admin/editor-types";
import { LIMITS, validateAll } from "@/lib/admin/editor-validate";
import { folderForArea } from "@/lib/admin/media-config";
import { slugify } from "@/lib/admin/slug";
import type { SectionType } from "@/lib/content";

const TYPES = Object.keys(SECTION_LABEL) as SectionType[];

/** "+ Add section" row that opens a picker of block types. */
function Inserter({ onPick, prominent = false }: { onPick: (t: SectionType) => void; prominent?: boolean }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/[0.04] p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[12.5px] font-semibold">Choose a section</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cancel" className="grid size-7 place-items-center rounded-md text-muted hover:bg-foreground/5">
            <X className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TYPES.map((t) => {
            const Icon = SECTION_ICON[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onPick(t);
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary dark:text-[#9db8ff]">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold">{SECTION_LABEL[t]}</span>
                  <span className="block truncate text-[11.5px] text-muted">{SECTION_HINT[t]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`group flex w-full items-center gap-3 text-[13px] font-semibold text-muted transition-colors hover:text-primary ${
        prominent ? "rounded-2xl border-2 border-dashed border-border py-4 hover:border-primary" : "py-1.5"
      }`}
    >
      {!prominent && <span className="h-px flex-1 bg-border transition-colors group-hover:bg-primary/40" />}
      <span className={`inline-flex items-center gap-1.5 ${prominent ? "mx-auto" : ""}`}>
        <Plus className="size-4" aria-hidden /> Add section
      </span>
      {!prominent && <span className="h-px flex-1 bg-border transition-colors group-hover:bg-primary/40" />}
    </button>
  );
}

export function PageEditor({
  area,
  initial,
  categories,
}: {
  area: EditorArea;
  initial: EditorData;
  categories: { id: string; label: string }[];
}) {
  const router = useRouter();
  const toast = useToast();
  const listBase = area === "docs" ? "/admin/docs" : "/admin/resources";
  const publicBase = area === "docs" ? "/docs" : "/resource";
  const folder = folderForArea(area);

  const [page, setPage] = useState<EditorPage>(initial.page);
  const [sections, setSections] = useState<EditorSection[]>(initial.sections);
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify({ page: initial.page, sections: initial.sections }));
  const [errors, setErrors] = useState<{ page: Record<string, string>; sections: Record<string, string> }>({ page: {}, sections: {} });
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const dirty = useMemo(() => JSON.stringify({ page, sections }) !== snapshot, [page, sections, snapshot]);
  useUnsavedGuard(dirty);

  /* ------------------------------ page fields ----------------------------- */
  const patchPage = useCallback((patch: Partial<EditorPage>) => {
    setPage((prev) => {
      const next = { ...prev, ...patch };
      if ("title" in patch && !prev.slugTouched) next.slug = slugify(patch.title ?? "");
      return next;
    });
    setErrors((e) => {
      const keys = Object.keys(patch).map((k) => (k === "cover" ? "cover" : k));
      if (!keys.some((k) => k in e.page)) return e;
      const rest = { ...e.page };
      keys.forEach((k) => delete rest[k]);
      if ("title" in patch) delete rest.slug;
      return { ...e, page: rest };
    });
  }, []);

  /* ------------------------------- sections ------------------------------- */
  const clearSectionError = (key: string) =>
    setErrors((e) => {
      if (!(key in e.sections)) return e;
      const rest = { ...e.sections };
      delete rest[key];
      return { ...e, sections: rest };
    });

  const addSection = (type: SectionType, at: number) => {
    const s = newSection(type);
    setSections((list) => [...list.slice(0, at), s, ...list.slice(at)]);
    setMode("edit");
    setTimeout(() => document.getElementById(`section-${s.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const patchSection = (key: string, patch: Partial<EditorSection>) => {
    setSections((list) => list.map((s) => (s.key === key ? { ...s, ...patch } : s)));
    clearSectionError(key);
  };

  const patchContent = (key: string, content: Record<string, unknown>) => {
    setSections((list) => list.map((s) => (s.key === key ? { ...s, content: { ...s.content, ...content } } : s)));
    clearSectionError(key);
  };

  const removeSection = (s: EditorSection) => {
    const hasContent = JSON.stringify(s.content) !== JSON.stringify(newSection(s.type).content) || s.title.trim();
    if (hasContent && !window.confirm("Delete this section? You can still leave the page without saving to undo it.")) return;
    setSections((list) => list.filter((x) => x.key !== s.key));
    clearSectionError(s.key);
  };

  const duplicateSection = (s: EditorSection) => {
    const copy: EditorSection = { ...s, key: newKey(), content: structuredClone(s.content) };
    setSections((list) => {
      const i = list.findIndex((x) => x.key === s.key);
      return [...list.slice(0, i + 1), copy, ...list.slice(i + 1)];
    });
  };

  const moveSection = (key: string, dir: "up" | "down") =>
    setSections((list) => {
      const from = list.findIndex((x) => x.key === key);
      const to = dir === "up" ? from - 1 : from + 1;
      return to < 0 || to >= list.length ? list : arrayMove(list, from, to);
    });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    setSections((list) => {
      const from = list.findIndex((s) => s.key === e.active.id);
      const to = list.findIndex((s) => s.key === e.over!.id);
      return from < 0 || to < 0 ? list : arrayMove(list, from, to);
    });
  };

  const toggleCollapsed = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  /* --------------------------------- save --------------------------------- */
  async function save(opts: { publish?: boolean; overwrite?: boolean } = {}) {
    if (saving) return;
    const nextPage = opts.publish === undefined ? page : { ...page, published: opts.publish };

    const v = validateAll(nextPage, sections, area);
    setErrors({ page: v.pageErrors, sections: v.sectionErrors });
    if (v.count > 0) {
      toast.show("error", `Fix ${v.count} ${v.count === 1 ? "issue" : "issues"} before saving.`);
      const firstSection = sections.find((s) => v.sectionErrors[s.key]);
      if (Object.keys(v.pageErrors).length) {
        setSettingsOpen(true);
        setMode("edit");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (firstSection) {
        setMode("edit");
        setCollapsed((c) => {
          const n = new Set(c);
          n.delete(firstSection.key);
          return n;
        });
        setTimeout(() => document.getElementById(`section-${firstSection.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      }
      return;
    }

    setSaving(true);
    const res = await savePage({
      id: page.id,
      expectedUpdatedAt: opts.overwrite ? null : updatedAt,
      area,
      page: nextPage,
      sections,
    });
    setSaving(false);

    if (res.ok) {
      const saved: EditorPage = { ...nextPage, id: res.id, slug: res.slug, slugTouched: true };
      const wasNew = page.id === null;
      setPage(saved);
      setUpdatedAt(res.updatedAt);
      setSnapshot(JSON.stringify({ page: saved, sections }));
      setConflict(false);
      setErrors({ page: {}, sections: {} });
      toast.show("success", wasNew ? "Page created." : opts.publish === true ? "Saved and published." : opts.publish === false ? "Saved and moved to drafts." : "Saved.");
      if (wasNew) router.replace(`${listBase}/${res.id}`);
      return;
    }

    if (res.code === "conflict") {
      setConflict(true);
      return;
    }
    if (res.fieldErrors || res.sectionErrors) {
      setErrors({ page: res.fieldErrors ?? {}, sections: res.sectionErrors ?? {} });
      if (res.fieldErrors) setSettingsOpen(true);
    }
    toast.show("error", res.error);
  }

  // Cmd/Ctrl+S saves. A ref keeps the handler pointing at the latest state.
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const categoryLabel = categories.find((c) => c.id === page.categoryId)?.label ?? "";
  const isNew = page.id === null;
  const settingsErrorCount = Object.keys(errors.page).filter((k) => k !== "title" && k !== "description").length;

  return (
    <div>
      {/* ------------------------------ top bar ------------------------------ */}
      <div className="sticky top-14 z-20 -mx-4 mb-6 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={listBase} className="text-[13px] font-medium text-muted transition-colors hover:text-foreground">
              ← {area === "docs" ? "Docs" : "Resources"}
            </Link>
            <Badge tone={page.published ? "success" : "warning"}>{page.published ? "Published" : "Draft"}</Badge>
            <span aria-live="polite" className="text-[12.5px] text-muted">
              {saving ? "Saving…" : dirty ? "Unsaved changes" : isNew ? "" : "All changes saved"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {page.id && page.published && (
              <a href={`${publicBase}/${page.slug}`} target="_blank" rel="noreferrer" className={btn("ghost", "sm")}>
                <ExternalLink className="size-3.5" aria-hidden /> View live
              </a>
            )}
            <button type="button" onClick={() => setSettingsOpen((v) => !v)} aria-expanded={settingsOpen} className={`${btn("secondary", "sm")} xl:hidden`}>
              <SlidersHorizontal className="size-3.5" aria-hidden /> Settings
              {settingsErrorCount > 0 && <span className="ml-0.5 size-2 rounded-full bg-red-500" aria-label="has errors" />}
            </button>
            <button type="button" onClick={() => save({ publish: !page.published })} disabled={saving} className={btn("secondary", "sm")}>
              {page.published ? "Unpublish" : "Publish"}
            </button>
            <button type="button" onClick={() => save()} disabled={saving || (!dirty && !isNew)} className={btn("primary", "sm")}>
              {saving ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
              Save
            </button>
          </div>
        </div>
      </div>

      {conflict && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-[13.5px]">
          <p className="flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>This page was changed somewhere else since you opened it. Saving now would overwrite those changes.</span>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => router.refresh()} className={btn("secondary", "sm")}>
              Discard mine, load latest
            </button>
            <button type="button" onClick={() => save({ overwrite: true })} className={btn("danger", "sm")}>
              Overwrite with mine
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        {/* ------------------------------- main -------------------------------- */}
        <div className="min-w-0 space-y-6">
          <div className="space-y-3">
            <div>
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <input
                id="title"
                value={page.title}
                onChange={(e) => patchPage({ title: e.target.value })}
                maxLength={LIMITS.title}
                placeholder="Page title"
                aria-invalid={errors.page.title ? true : undefined}
                className="w-full rounded-xl border border-transparent bg-transparent px-1 py-1 font-display text-[28px] font-extrabold tracking-tight outline-none placeholder:text-muted/50 focus:border-border focus:bg-card sm:text-[34px]"
              />
              {errors.page.title && (
                <p role="alert" className="mt-1 px-1 text-[12.5px] text-red-600 dark:text-red-400">
                  {errors.page.title}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                id="description"
                value={page.description}
                onChange={(e) => patchPage({ description: e.target.value })}
                maxLength={LIMITS.description}
                rows={2}
                placeholder="A short summary shown under the title and on cards"
                className={`${inputClass} h-auto resize-none py-2.5 leading-relaxed`}
              />
              {errors.page.description && (
                <p role="alert" className="mt-1 text-[12.5px] text-red-600 dark:text-red-400">
                  {errors.page.description}
                </p>
              )}
            </div>
          </div>

          <div role="tablist" aria-label="Editor mode" className="inline-flex rounded-xl border border-border bg-card p-1">
            {(
              [
                ["edit", "Edit", Pencil],
                ["preview", "Preview", Eye],
              ] as const
            ).map(([m, label, Icon]) => (
              <button
                key={m}
                role="tab"
                type="button"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" aria-hidden /> {label}
              </button>
            ))}
          </div>

          {mode === "preview" ? (
            <EditorPreview area={area} page={page} sections={sections} categoryLabel={categoryLabel} />
          ) : (
            <div>
              {sections.length === 0 ? (
                <Inserter prominent onPick={(t) => addSection(t, 0)} />
              ) : (
                <DndContext id="sections-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={sections.map((s) => s.key)} strategy={verticalListSortingStrategy}>
                    {sections.map((s, i) => (
                      <Fragment key={s.key}>
                        {i > 0 && <Inserter onPick={(t) => addSection(t, i)} />}
                        <SectionCard
                          section={s}
                          index={i}
                          total={sections.length}
                          folder={folder}
                          error={errors.sections[s.key]}
                          collapsed={collapsed.has(s.key)}
                          onToggle={() => toggleCollapsed(s.key)}
                          onTitle={(title) => patchSection(s.key, { title })}
                          onContent={(c) => patchContent(s.key, c)}
                          onRemove={() => removeSection(s)}
                          onDuplicate={() => duplicateSection(s)}
                          onMove={(dir) => moveSection(s.key, dir)}
                        />
                      </Fragment>
                    ))}
                  </SortableContext>
                </DndContext>
              )}
              {sections.length > 0 && (
                <div className="mt-3">
                  <Inserter prominent onPick={(t) => addSection(t, sections.length)} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ------------------------------ settings ------------------------------ */}
        <aside className={`${settingsOpen ? "block" : "hidden"} order-first xl:order-none xl:block xl:sticky xl:top-[7.5rem]`}>
          <SettingsPanel
            area={area}
            page={page}
            errors={errors.page}
            categories={categories}
            onChange={patchPage}
            onDeleted={() => router.push(listBase)}
          />
        </aside>
      </div>
    </div>
  );
}

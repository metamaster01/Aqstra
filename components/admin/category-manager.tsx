"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Folder, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { ActionForm } from "./action-form";
import { ConfirmAction } from "./confirm-action";
import { Badge, btn, cardClass, iconBtn, inputClass } from "./ui";
import {
  createCategory,
  deleteCategory,
  moveCategory,
  updateCategory,
} from "@/app/admin/(panel)/categories/actions";
import type { CategoryItem } from "@/lib/admin/queries";

/* ------------------------------- helpers -------------------------------- */

function groupByParent(items: CategoryItem[]) {
  const map = new Map<string | null, CategoryItem[]>();
  for (const c of items) map.set(c.parentId, [...(map.get(c.parentId) ?? []), c]);
  for (const list of map.values()) {
    list.sort((a, b) => a.orderIndex - b.orderIndex || a.title.localeCompare(b.title));
  }
  return map;
}

/** The category and everything nested under it (these can't be chosen as its parent). */
function descendantIds(root: string, byParent: Map<string | null, CategoryItem[]>) {
  const out = new Set<string>([root]);
  const stack = [root];
  while (stack.length) {
    for (const child of byParent.get(stack.pop()!) ?? []) {
      if (!out.has(child.id)) {
        out.add(child.id);
        stack.push(child.id);
      }
    }
  }
  return out;
}

/** "Parent › Child" labels in tree order, for <select>. */
function parentOptions(items: CategoryItem[], byParent: Map<string | null, CategoryItem[]>, exclude: Set<string>) {
  const out: { id: string; label: string }[] = [];
  const walk = (parentId: string | null, prefix: string) => {
    for (const c of byParent.get(parentId) ?? []) {
      if (exclude.has(c.id)) continue;
      const label = prefix ? `${prefix} › ${c.title}` : c.title;
      out.push({ id: c.id, label });
      walk(c.id, label);
    }
  };
  walk(null, "");
  return out;
}

/* ------------------------------ edit dialog ------------------------------ */

function EditDialog({
  category,
  items,
  byParent,
  onClose,
}: {
  category: CategoryItem;
  items: CategoryItem[];
  byParent: Map<string | null, CategoryItem[]>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const options = parentOptions(items, byParent, descendantIds(category.id, byParent));

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="w-[calc(100%-2rem)] max-w-[440px] rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/50"
    >
      <ActionForm action={updateCategory} onDone={(r) => r.ok && ref.current?.close()} className="p-6">
        {(pending) => (
          <>
            <input type="hidden" name="id" value={category.id} />
            <h2 className="font-display font-bold tracking-tight" style={{ margin: 0, fontSize: 18 }}>
              Edit group
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="edit-title" className="mb-1.5 block text-[13px] font-semibold">
                  Name
                </label>
                <input id="edit-title" name="title" defaultValue={category.title} required maxLength={80} className={inputClass} />
              </div>
              <div>
                <label htmlFor="edit-slug" className="mb-1.5 block text-[13px] font-semibold">
                  Slug
                </label>
                <input id="edit-slug" name="slug" defaultValue={category.slug} className={`${inputClass} font-mono text-[13px]`} />
                <p className="mt-1.5 text-[12px] text-muted">Used internally. Changing it does not change any page URLs.</p>
              </div>
              <div>
                <label htmlFor="edit-parent" className="mb-1.5 block text-[13px] font-semibold">
                  Inside
                </label>
                <select id="edit-parent" name="parentId" defaultValue={category.parentId ?? ""} className={inputClass}>
                  <option value="">Top level</option>
                  {options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => ref.current?.close()} className={btn("secondary")}>
                Cancel
              </button>
              <button type="submit" disabled={pending} className={btn("primary")}>
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Save changes
              </button>
            </div>
          </>
        )}
      </ActionForm>
    </dialog>
  );
}

/* -------------------------------- manager -------------------------------- */

export function CategoryManager({ area, items }: { area: "docs" | "resource"; items: CategoryItem[] }) {
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const byParent = useMemo(() => groupByParent(items), [items]);
  const addOptions = useMemo(() => parentOptions(items, byParent, new Set()), [items, byParent]);

  const renderLevel = (parentId: string | null, depth: number) => {
    const list = byParent.get(parentId) ?? [];
    return (
      <ul className={depth > 0 ? "mt-2 space-y-2 border-l border-border pl-3 sm:pl-5" : "space-y-2"}>
        {list.map((c, i) => {
          const childCount = byParent.get(c.id)?.length ?? 0;
          const blocked = c.pageCount > 0 || childCount > 0;
          return (
            <li key={c.id}>
              <div className={`${cardClass} flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-3`}>
                <Folder className="size-4 shrink-0 text-primary dark:text-[#9db8ff]" aria-hidden />
                <div className="min-w-0 flex-1 basis-40">
                  <p className="truncate text-[14px] font-semibold">{c.title}</p>
                  <p className="truncate font-mono text-[11.5px] text-muted">{c.slug}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge tone={c.pageCount ? "info" : "neutral"}>
                    {c.pageCount} page{c.pageCount === 1 ? "" : "s"}
                  </Badge>
                  {childCount > 0 && <Badge>{childCount} sub-group{childCount === 1 ? "" : "s"}</Badge>}
                </div>

                <div className="ml-auto flex items-center">
                  {(["up", "down"] as const).map((dir) => (
                    <ActionForm key={dir} action={moveCategory} className="inline-flex">
                      {(pending) => (
                        <>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="dir" value={dir} />
                          <button
                            type="submit"
                            disabled={pending || (dir === "up" ? i === 0 : i === list.length - 1)}
                            aria-label={dir === "up" ? `Move ${c.title} up` : `Move ${c.title} down`}
                            title={dir === "up" ? "Move up" : "Move down"}
                            className={iconBtn}
                          >
                            {dir === "up" ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                          </button>
                        </>
                      )}
                    </ActionForm>
                  ))}

                  <button
                    type="button"
                    onClick={() => setEditing(c)}
                    aria-label={`Edit ${c.title}`}
                    title="Edit"
                    className={iconBtn}
                  >
                    <Pencil className="size-4" />
                  </button>

                  {blocked ? (
                    <button
                      type="button"
                      disabled
                      aria-label={`${c.title} can't be deleted yet`}
                      title={c.pageCount > 0 ? "Move or delete its pages first" : "Move or delete its sub-groups first"}
                      className={iconBtn}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  ) : (
                    <ConfirmAction
                      action={deleteCategory}
                      fields={{ id: c.id }}
                      title="Delete this group?"
                      message={`"${c.title}" will be removed. This can't be undone.`}
                      confirmLabel="Delete group"
                      trigger={<Trash2 className="size-4" />}
                      triggerLabel={`Delete ${c.title}`}
                      triggerClassName={`${iconBtn} hover:text-red-600`}
                    />
                  )}
                </div>
              </div>

              {childCount > 0 && renderLevel(c.id, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="space-y-5">
      {/* Add */}
      <section className={`${cardClass} p-4 sm:p-5`} aria-labelledby="add-group">
        <h2 id="add-group" className="font-display font-bold" style={{ margin: 0, fontSize: 16 }}>
          Add a group
        </h2>
        <ActionForm action={createCategory} resetOnSuccess className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)_auto]">
          {(pending) => (
            <>
              <input type="hidden" name="area" value={area} />
              <div>
                <label htmlFor="new-title" className="sr-only">
                  Group name
                </label>
                <input
                  id="new-title"
                  name="title"
                  required
                  maxLength={80}
                  placeholder={area === "docs" ? "e.g. Getting started" : "e.g. Lead generation"}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="new-parent" className="sr-only">
                  Inside
                </label>
                <select id="new-parent" name="parentId" className={inputClass} defaultValue="">
                  <option value="">Top level</option>
                  {addOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      Inside: {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={pending} className={btn("primary")}>
                {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                Add
              </button>
            </>
          )}
        </ActionForm>
      </section>

      {/* Tree */}
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-[14px] text-muted">
          No groups yet. Add your first one above.
        </p>
      ) : (
        renderLevel(null, 0)
      )}

      {editing && (
        <EditDialog key={editing.id} category={editing} items={items} byParent={byParent} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

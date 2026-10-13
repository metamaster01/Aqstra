"use client";

import { ArrowDown, ArrowUp, ChevronDown, Code2, Copy, GripVertical, ImageIcon, Info, ListChecks, Trash2, Type, Video, type LucideIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionForm } from "./section-forms";
import { Badge, iconBtn, inputClass } from "@/components/admin/ui";
import { SECTION_LABEL, type EditorSection } from "@/lib/admin/editor-types";
import { LIMITS } from "@/lib/admin/editor-validate";
import { slugify } from "@/lib/admin/slug";
import type { MediaFolder } from "@/lib/admin/media-config";
import type { SectionType } from "@/lib/content";

export const SECTION_ICON: Record<SectionType, LucideIcon> = {
  text: Type,
  image: ImageIcon,
  video: Video,
  callout: Info,
  code: Code2,
  list: ListChecks,
};

function summary(s: EditorSection): string {
  const c = s.content;
  const first =
    (typeof c.body === "string" && c.body) ||
    (typeof c.caption === "string" && c.caption) ||
    (typeof c.code === "string" && c.code) ||
    (Array.isArray(c.items) && typeof c.items[0] === "string" && c.items[0]) ||
    (typeof c.url === "string" && c.url) ||
    "";
  return first.replace(/\s+/g, " ").slice(0, 90);
}

export function SectionCard({
  section,
  index,
  total,
  folder,
  error,
  collapsed,
  onToggle,
  onTitle,
  onContent,
  onRemove,
  onDuplicate,
  onMove,
}: {
  section: EditorSection;
  index: number;
  total: number;
  folder: MediaFolder;
  error?: string;
  collapsed: boolean;
  onToggle: () => void;
  onTitle: (title: string) => void;
  onContent: (patch: Record<string, unknown>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: section.key,
  });
  const Icon = SECTION_ICON[section.type];
  const anchor = slugify(section.title);

  return (
    <div
      ref={setNodeRef}
      id={`section-${section.key}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-2xl border bg-card dark:bg-white/[0.03] ${
        error ? "border-red-500/50" : "border-border dark:border-white/15"
      } ${isDragging ? "relative z-10 shadow-2xl ring-2 ring-primary/40" : ""}`}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder section ${index + 1}`}
          title="Drag to reorder"
          className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted hover:bg-foreground/5 hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-1.5 text-left"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary dark:text-[#9db8ff]">
            <Icon className="size-4" aria-hidden />
          </span>
          <span className="shrink-0 text-[13px] font-semibold">
            {index + 1}. {SECTION_LABEL[section.type]}
          </span>
          {collapsed && (
            <span className="min-w-0 truncate text-[12.5px] text-muted">
              {section.title ? `${section.title} · ` : ""}
              {summary(section)}
            </span>
          )}
          {error && <Badge tone="danger">Needs attention</Badge>}
          <ChevronDown className={`ml-auto size-4 shrink-0 text-muted transition-transform ${collapsed ? "" : "rotate-180"}`} aria-hidden />
        </button>

        <div className="flex shrink-0 items-center">
          <button type="button" onClick={() => onMove("up")} disabled={index === 0} aria-label="Move up" title="Move up" className={`${iconBtn} hidden sm:grid`}>
            <ArrowUp className="size-4" />
          </button>
          <button type="button" onClick={() => onMove("down")} disabled={index === total - 1} aria-label="Move down" title="Move down" className={`${iconBtn} hidden sm:grid`}>
            <ArrowDown className="size-4" />
          </button>
          <button type="button" onClick={onDuplicate} aria-label="Duplicate section" title="Duplicate" className={iconBtn}>
            <Copy className="size-4" />
          </button>
          <button type="button" onClick={onRemove} aria-label="Delete section" title="Delete" className={`${iconBtn} hover:text-red-600`}>
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-5 border-t border-border px-4 pb-5 pt-4 sm:px-5">
          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-700 dark:text-red-300">
              {error}
            </p>
          )}

          <div>
            <label htmlFor={`${section.key}-title`} className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px] font-semibold">
              <span>Heading</span>
              <span className="text-[11.5px] font-normal text-muted">
                {anchor ? `Appears in the page menu as #${anchor}` : "Optional. Headings fill the “On this page” menu"}
              </span>
            </label>
            <input
              id={`${section.key}-title`}
              value={section.title}
              onChange={(e) => onTitle(e.target.value)}
              maxLength={LIMITS.sectionTitle}
              placeholder="e.g. Getting started"
              className={inputClass}
            />
          </div>

          <SectionForm section={section} folder={folder} onContent={onContent} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { MediaField } from "@/components/admin/media/media-field";
import { inputClass } from "@/components/admin/ui";
import { CALLOUT_VARIANTS, IMAGE_WIDTHS, type EditorSection } from "@/lib/admin/editor-types";
import { LIMITS, checkUrl } from "@/lib/admin/editor-validate";
import type { MediaFolder } from "@/lib/admin/media-config";

const TEXTAREA = `${inputClass} h-auto py-2.5 leading-relaxed`;

/** A textarea that grows with its content. */
function AutoTextarea({
  value,
  onChange,
  minRows = 4,
  className = "",
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  minRows?: number;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${TEXTAREA} resize-none overflow-hidden ${className}`}
      {...rest}
    />
  );
}

function Label({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px] font-semibold">
      <span>{children}</span>
      {hint && <span className="text-[11.5px] font-normal text-muted">{hint}</span>}
    </label>
  );
}

const WIDTH_LABEL: Record<(typeof IMAGE_WIDTHS)[number], string> = {
  full: "Full width (16:9)",
  half: "Half width (4:3)",
  inline: "Small (4:3)",
};

export function SectionForm({
  section,
  folder,
  onContent,
}: {
  section: EditorSection;
  folder: MediaFolder;
  onContent: (patch: Record<string, unknown>) => void;
}) {
  const c = section.content;
  const text = (k: string) => (typeof c[k] === "string" ? (c[k] as string) : "");
  const id = (k: string) => `${section.key}-${k}`;

  switch (section.type) {
    case "text":
      return (
        <div>
          <Label htmlFor={id("body")} hint="Separate paragraphs with a blank line">
            Text
          </Label>
          <AutoTextarea
            id={id("body")}
            value={text("body")}
            onChange={(v) => onContent({ body: v })}
            minRows={5}
            maxLength={LIMITS.body}
            placeholder="Start writing…"
          />
        </div>
      );

    case "image": {
      const url = text("url");
      return (
        <div className="space-y-4">
          <MediaField
            label="Image"
            kind="image"
            folder={folder}
            value={url}
            onChange={(v) => onContent({ url: v })}
            error={checkUrl(url, "image") ?? undefined}
            hint="Shown cropped to the width you choose below. Large photos are shrunk automatically."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor={id("alt")} hint="For screen readers">
                Alt text
              </Label>
              <input
                id={id("alt")}
                value={text("alt")}
                onChange={(e) => onContent({ alt: e.target.value })}
                maxLength={LIMITS.alt}
                placeholder="Describe what the image shows"
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor={id("width")}>Size</Label>
              <select
                id={id("width")}
                value={text("width") || "full"}
                onChange={(e) => onContent({ width: e.target.value })}
                className={inputClass}
              >
                {IMAGE_WIDTHS.map((w) => (
                  <option key={w} value={w}>
                    {WIDTH_LABEL[w]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor={id("caption")} hint="Optional">
              Caption
            </Label>
            <input
              id={id("caption")}
              value={text("caption")}
              onChange={(e) => onContent({ caption: e.target.value })}
              maxLength={LIMITS.caption}
              className={inputClass}
            />
          </div>
        </div>
      );
    }

    case "video":
      return (
        <div className="space-y-4">
          <MediaField
            label="Video"
            kind="video"
            folder={folder}
            value={text("url")}
            onChange={(v) => onContent({ url: v })}
            error={checkUrl(text("url"), "other") ?? undefined}
            hint="MP4 or WebM. Keep clips short: large videos are slow for visitors."
          />
          <MediaField
            label="Poster image (optional)"
            kind="image"
            folder={folder}
            value={text("poster")}
            onChange={(v) => onContent({ poster: v })}
            aspect="aspect-[16/6]"
            hint="Shown before the video plays."
          />
          <div>
            <Label htmlFor={id("caption")} hint="Optional">
              Caption
            </Label>
            <input
              id={id("caption")}
              value={text("caption")}
              onChange={(e) => onContent({ caption: e.target.value })}
              maxLength={LIMITS.caption}
              className={inputClass}
            />
          </div>
        </div>
      );

    case "callout":
      return (
        <div className="space-y-4">
          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold">Style</legend>
            <div className="flex flex-wrap gap-2">
              {CALLOUT_VARIANTS.map((v) => (
                <label key={v} className="cursor-pointer">
                  <input
                    type="radio"
                    name={id("variant")}
                    value={v}
                    checked={(text("variant") || "info") === v}
                    onChange={() => onContent({ variant: v })}
                    className="peer sr-only"
                  />
                  <span className="inline-flex rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] font-semibold capitalize text-muted transition-colors hover:border-primary peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary dark:peer-checked:text-[#9db8ff]">
                    {v}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <Label htmlFor={id("body")}>Text</Label>
            <AutoTextarea
              id={id("body")}
              value={text("body")}
              onChange={(v) => onContent({ body: v })}
              minRows={3}
              maxLength={LIMITS.callout}
            />
          </div>
        </div>
      );

    case "code":
      return (
        <div className="space-y-4">
          <div className="sm:max-w-[220px]">
            <Label htmlFor={id("language")}>Language</Label>
            <input
              id={id("language")}
              list="code-languages"
              value={text("language")}
              onChange={(e) => onContent({ language: e.target.value })}
              maxLength={LIMITS.language}
              className={inputClass}
            />
            <datalist id="code-languages">
              {["tsx", "ts", "js", "json", "bash", "sql", "html", "css", "python", "text"].map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>
          <div>
            <Label htmlFor={id("code")}>Code</Label>
            <AutoTextarea
              id={id("code")}
              value={text("code")}
              onChange={(v) => onContent({ code: v })}
              minRows={6}
              maxLength={LIMITS.code}
              spellCheck={false}
              className="font-mono text-[13px]"
            />
          </div>
        </div>
      );

    case "list": {
      const items = Array.isArray(c.items) ? (c.items as unknown[]).map((i) => (typeof i === "string" ? i : "")) : [""];
      const set = (next: string[]) => onContent({ items: next });
      const focusItem = (i: number) =>
        setTimeout(() => document.getElementById(`${section.key}-item-${i}`)?.focus(), 0);

      return (
        <div>
          <Label>Items</Label>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary/70" />
                <input
                  id={`${section.key}-item-${i}`}
                  value={item}
                  maxLength={LIMITS.listItem}
                  aria-label={`Item ${i + 1}`}
                  onChange={(e) => set(items.map((x, j) => (j === i ? e.target.value : x)))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (items.length < LIMITS.listItems) {
                        set([...items.slice(0, i + 1), "", ...items.slice(i + 1)]);
                        focusItem(i + 1);
                      }
                    }
                    if (e.key === "Backspace" && item === "" && items.length > 1) {
                      e.preventDefault();
                      set(items.filter((_, j) => j !== i));
                      focusItem(Math.max(0, i - 1));
                    }
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text");
                    if (!pasted.includes("\n")) return;
                    e.preventDefault(); // a pasted block becomes one item per line
                    const lines = pasted.split(/\r?\n/).map((l) => l.replace(/^[\s•\-*]+/, "").trim()).filter(Boolean);
                    set([...items.slice(0, i), ...lines, ...items.slice(item === "" ? i + 1 : i + 1)].slice(0, LIMITS.listItems));
                  }}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => set(items.length > 1 ? items.filter((_, j) => j !== i) : [""])}
                  aria-label={`Remove item ${i + 1}`}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-foreground/5 hover:text-red-600"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={items.length >= LIMITS.listItems}
            onClick={() => {
              set([...items, ""]);
              focusItem(items.length);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors hover:text-primary-hover disabled:opacity-40 dark:text-[#9db8ff]"
          >
            <Plus className="size-4" aria-hidden /> Add item
          </button>
          <p className="mt-2 text-[12px] text-muted">Press Enter for a new item. Pasting several lines creates one item per line.</p>
        </div>
      );
    }
  }
}

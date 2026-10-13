"use client";

import { Component, type ReactNode } from "react";
import { SectionRenderer } from "@/components/docs/section-renderer";
import { checkUrl } from "@/lib/admin/editor-validate";
import type { EditorArea, EditorPage, EditorSection } from "@/lib/admin/editor-types";
import { slugify } from "@/lib/admin/slug";
import type { PageSection, SectionContent } from "@/lib/content";

/** If a half-finished section can't render, say so instead of taking the whole editor down. */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-800 dark:text-amber-300">
        The preview couldn&apos;t be drawn. Check that each section is complete, then switch back to Edit.
      </p>
    ) : (
      this.props.children
    );
  }
}

function toPreviewSections(sections: EditorSection[]): PageSection[] {
  return sections.map((s, i) => {
    let type = s.type;
    let content = s.content as unknown as SectionContent;

    // Show a clear placeholder instead of a broken image or video.
    const url = typeof s.content.url === "string" ? s.content.url : "";
    if ((s.type === "image" || s.type === "video") && (!url || checkUrl(url, s.type === "image" ? "image" : "other"))) {
      type = "callout";
      content = { variant: "warning", body: `This ${s.type} isn't set yet, so it won't show.` };
    }

    return {
      id: s.key,
      pageId: "",
      orderIndex: i,
      type,
      title: s.title.trim() || null,
      anchor: slugify(s.title) || null,
      content,
    };
  });
}

export function EditorPreview({
  area,
  page,
  sections,
  categoryLabel,
}: {
  area: EditorArea;
  page: EditorPage;
  sections: EditorSection[];
  categoryLabel: string;
}) {
  const eyebrow = area === "docs" ? categoryLabel : page.tag || page.type;

  return (
    <div>
      <p className="mb-3 text-[12.5px] text-muted">Preview of your current edits, including anything not saved yet.</p>
      <article className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-10 sm:py-12">
        <div className={`mx-auto max-w-[720px] ${area === "resource" ? "" : ""}`}>
          {eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">{eyebrow}</p>}
          <h1
            className="mt-2 font-display font-extrabold text-foreground"
            style={{ fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "8px 0 0" }}
          >
            {page.title || "Untitled page"}
          </h1>
          {page.description && <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{page.description}</p>}
          {area === "resource" && (page.readTime || categoryLabel) && (
            <p className="mt-4 text-xs text-muted">{[page.readTime, categoryLabel].filter(Boolean).join(" · ")}</p>
          )}
          {area === "resource" && page.cover && !checkUrl(page.cover, "image") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.cover} alt="" className="mt-8 aspect-[16/7] w-full rounded-2xl border border-border object-cover" />
          )}

          <div className="mt-10">
            {sections.length === 0 ? (
              <p className="text-[14px] text-muted">No sections yet.</p>
            ) : (
              <Boundary>
                <SectionRenderer sections={toPreviewSections(sections)} />
              </Boundary>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

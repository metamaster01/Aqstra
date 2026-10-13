import type { SectionType } from "@/lib/content";

export type EditorArea = "docs" | "resource";

export const RESOURCE_TYPE_OPTIONS = ["Article", "Guide", "Video", "Blog"] as const;
export const ACCENT_OPTIONS = ["navy", "violet", "teal", "slate"] as const;
export const CALLOUT_VARIANTS = ["info", "tip", "warning"] as const;
export const IMAGE_WIDTHS = ["full", "half", "inline"] as const;

export type EditorPage = {
  id: string | null; // null until the first save
  title: string;
  slug: string;
  slugTouched: boolean; // false = keep the slug in step with the title
  description: string;
  categoryId: string;
  type: string; // "Doc" for docs; Article | Guide | Video | Blog for resources
  tag: string;
  readTime: string;
  accent: string;
  featured: "" | "main" | "side";
  cover: string;
  published: boolean;
  orderIndex: number | null; // null = place at the end
};

export type EditorSection = {
  key: string; // also the row id in page_sections
  type: SectionType;
  title: string;
  content: Record<string, unknown>;
};

export type EditorData = { page: EditorPage; sections: EditorSection[]; updatedAt: string | null };

export const SECTION_LABEL: Record<SectionType, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  callout: "Callout",
  code: "Code",
  list: "List",
};

export const SECTION_HINT: Record<SectionType, string> = {
  text: "Paragraphs of writing",
  image: "A picture with a caption",
  video: "An MP4 or WebM clip",
  callout: "A highlighted tip or warning",
  code: "A code snippet",
  list: "A bulleted list",
};

export function newKey(): string {
  return crypto.randomUUID();
}

export function newSection(type: SectionType): EditorSection {
  const content: Record<SectionType, Record<string, unknown>> = {
    text: { body: "" },
    image: { url: "", alt: "", caption: "", width: "full" },
    video: { url: "", poster: "", caption: "" },
    callout: { variant: "info", body: "" },
    code: { language: "tsx", code: "" },
    list: { items: [""] },
  };
  return { key: newKey(), type, title: "", content: content[type] };
}

export function blankPage(area: EditorArea, categoryId = ""): EditorPage {
  return {
    id: null,
    title: "",
    slug: "",
    slugTouched: false,
    description: "",
    categoryId,
    type: area === "docs" ? "Doc" : "Article",
    tag: "",
    readTime: "",
    accent: "navy",
    featured: "",
    cover: "",
    published: false,
    orderIndex: null,
  };
}

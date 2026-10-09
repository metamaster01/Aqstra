/**
 * Shared types for the content model that backs both /docs and /resource.
 * Mirrors supabase/schema.sql exactly — if you add a column, add it here too.
 */

export type Accent = "navy" | "violet" | "teal" | "slate";
export type PageType = "Doc" | "Article" | "Guide" | "Video" | "Blog";
export type ResourceType = Exclude<PageType, "Doc">;
export type Featured = "main" | "side" | null;
export type Area = "docs" | "resource";

export const TYPE_FILTERS = ["All", "Article", "Guide", "Video", "Blog"] as const;
export type TypeFilter = (typeof TYPE_FILTERS)[number];

export const TYPE_LABEL: Record<TypeFilter, string> = {
  All: "All",
  Article: "Articles",
  Guide: "Guides",
  Video: "Videos",
  Blog: "Blog",
};

export interface DocCategory {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  area: Area;
  icon: string | null;
  orderIndex: number;
  children?: DocCategory[]; // populated client-side when building the tree
}

/** Shape used everywhere a card/page summary is needed (docs nav, resource cards, TOC source). */
export interface DocPage {
  id: string;
  categoryId: string | null;
  slug: string;
  title: string;
  description: string | null;
  cover: string | null; // cover_image_url
  type: PageType;
  tag: string | null;
  readTime: string | null;
  category: string | null; // resolved category title, for the card's meta line
  accent: Accent;
  featured: Featured;
  orderIndex: number;
}

/** Alias kept for drop-in compatibility with the existing resource-card.tsx props. */
export type Resource = DocPage;

export type SectionType = "text" | "image" | "video" | "callout" | "code" | "list";

export interface TextContent {
  body: string;
}
export interface ImageContent {
  url: string;
  alt?: string;
  caption?: string;
  width?: "full" | "half" | "inline";
}
export interface VideoContent {
  url: string;
  poster?: string;
  caption?: string;
}
export interface CalloutContent {
  variant: "info" | "warning" | "tip";
  body: string;
}
export interface CodeContent {
  language: string;
  code: string;
}
export interface ListContent {
  items: string[];
}

export type SectionContent =
  | TextContent
  | ImageContent
  | VideoContent
  | CalloutContent
  | CodeContent
  | ListContent;

export interface PageSection {
  id: string;
  pageId: string;
  orderIndex: number;
  type: SectionType;
  title: string | null;
  anchor: string | null;
  content: SectionContent;
}

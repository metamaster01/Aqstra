export type ResourceType = "Article" | "Guide" | "Video" | "Blog";
export type Accent = "navy" | "violet" | "teal" | "slate";

export type Resource = {
  slug: string;
  type: ResourceType;
  /** Small badge text, e.g. "Strategy" */
  tag: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  accent: Accent;
  /** Image in /public. Used by the big featured card. */
  cover?: string;
  /** "main" = large card, "side" = the two stacked cards */
  featured?: "main" | "side";
};

/**
 * Demo content for the Resources front page.
 * Later this can come from a CMS / MDX / database – the UI only needs this shape.
 */
export const RESOURCES: Resource[] = [
  /* ------------------------------- Featured ------------------------------- */
  {
    slug: "how-to-build-a-high-quality-b2b-lead-list-in-2026",
    type: "Guide",
    tag: "Featured guide",
    title: "How to build a high-quality B2B lead list in 2026",
    description:
      "A practical framework for finding, qualifying, and prioritizing prospects that are genuinely likely to become customers.",
    readTime: "12 min read",
    category: "Lead Generation",
    accent: "navy",
    cover: "/resource/resource-1.png",
    featured: "main",
  },
  {
    slug: "why-precision-beats-volume-in-b2b-prospecting",
    type: "Article",
    tag: "Strategy",
    title: "Why precision beats volume in B2B prospecting",
    description:
      "Learn why focused prospect lists create more opportunities than massive, unfiltered databases.",
    readTime: "7 min read",
    category: "Sales Strategy",
    accent: "violet",
    featured: "side",
  },
  {
    slug: "the-complete-guide-to-lead-qualification",
    type: "Guide",
    tag: "Guide",
    title: "The complete guide to lead qualification",
    description:
      "Build a consistent process for identifying the prospects most worth your team’s time.",
    readTime: "10 min read",
    category: "Lead Intelligence",
    accent: "teal",
    featured: "side",
  },

  /* -------------------------------- Latest -------------------------------- */
  {
    slug: "five-signals-a-prospect-is-ready-to-hear-from-you",
    type: "Article",
    tag: "Lead Intelligence",
    title: "5 signals that a prospect is ready to hear from you",
    description:
      "Hiring spikes, tech changes, funding news — how to spot buying intent before your competitors do.",
    readTime: "6 min read",
    category: "Lead Intelligence",
    accent: "violet",
  },
  {
    slug: "cold-email-openers-that-earn-replies",
    type: "Blog",
    tag: "Outreach",
    title: "Cold email openers that actually earn replies",
    description:
      "A teardown of first lines from real campaigns, and the simple patterns behind the best performers.",
    readTime: "5 min read",
    category: "Outreach",
    accent: "navy",
  },
  {
    slug: "inside-metamaster-how-we-classify-prospects",
    type: "Video",
    tag: "Product",
    title: "Inside MetaMaster: how prospects get classified",
    description:
      "A short walkthrough of how we discover, classify, and filter prospects for accuracy.",
    readTime: "4 min watch",
    category: "Product",
    accent: "slate",
  },
  {
    slug: "building-an-icp-your-whole-team-agrees-on",
    type: "Guide",
    tag: "Strategy",
    title: "Building an ICP your whole team agrees on",
    description:
      "Turn gut feeling into a clear, shared definition of the customers worth chasing.",
    readTime: "9 min read",
    category: "Sales Strategy",
    accent: "teal",
  },
  {
    slug: "enrichment-vs-verification",
    type: "Article",
    tag: "Data quality",
    title: "Enrichment vs. verification: what’s the difference?",
    description:
      "Why more data fields don’t mean better data — and how to keep your lists accurate over time.",
    readTime: "8 min read",
    category: "Data Quality",
    accent: "slate",
  },
  {
    slug: "a-30-day-outreach-cadence-template",
    type: "Blog",
    tag: "Outreach",
    title: "A 30-day outreach cadence you can copy",
    description:
      "Touchpoints, timing, and channels for turning a qualified shortlist into structured campaigns.",
    readTime: "7 min read",
    category: "Outreach",
    accent: "violet",
  },
];

export const TYPE_FILTERS = ["All", "Article", "Guide", "Video", "Blog"] as const;
export type TypeFilter = (typeof TYPE_FILTERS)[number];

export const TYPE_LABEL: Record<TypeFilter, string> = {
  All: "All",
  Article: "Articles",
  Guide: "Guides",
  Video: "Videos",
  Blog: "Blogs",
};

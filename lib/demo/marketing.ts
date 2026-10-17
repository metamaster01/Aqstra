/**
 * ⚠️  PLACEHOLDER CONTENT. REPLACE BEFORE LAUNCH.
 *
 * The client names and testimonials below are invented so the layout can be
 * reviewed. Showing made-up customers or quotes on a live site is misleading
 * (and, in many places, a legal problem). Replace each entry with a real
 * customer who has agreed to be named, then delete this notice.
 *
 * Real logos: add a `logo` path (an SVG/PNG in /public or on media.aqstra.com).
 * With a logo set, it is shown in grey; without one, the name is shown as text.
 */
import type { IconKey } from "@/lib/solutions";

export type Client = { name: string; icon: IconKey; logo?: string };

export const CLIENTS: Client[] = [
  { name: "Lumina Cloud", icon: "layers" },
  { name: "Brightpath", icon: "zap" },
  { name: "Corelane", icon: "network" },
  { name: "Ventura Pay", icon: "target" },
  { name: "Skyforge Labs", icon: "sparkles" },
  { name: "Pinegrove Health", icon: "shield" },
  { name: "Ardent Freight", icon: "send" },
  { name: "Novelle Learn", icon: "list" },
  { name: "Tidal Energy", icon: "chart" },
  { name: "Orchid Commerce", icon: "building" },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  highlight?: string; // short phrase to emphasize in the quote
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We used to spend the first hours of every week stitching lead lists together. Now the list arrives already ranked, and my team starts with the accounts that matter.",
    highlight: "already ranked",
    name: "Meera Iyer",
    role: "VP of Sales",
    company: "Lumina Cloud",
  },
  {
    quote:
      "The classification step changed how we talk about fit. Sales and marketing finally argue about the same definition of a good lead instead of two different ones.",
    highlight: "the same definition of a good lead",
    name: "Daniel Foster",
    role: "Head of Growth",
    company: "Ventura Pay",
  },
  {
    quote:
      "Verified contacts before outreach meant our bounce rate stopped being a worry. Sequences go out to people who are actually reachable.",
    highlight: "stopped being a worry",
    name: "Aisha Khan",
    role: "Director of Revenue Operations",
    company: "Ardent Freight",
  },
];

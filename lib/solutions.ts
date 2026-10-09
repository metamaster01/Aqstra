/**
 * Solution pages (/solutions/[slug]). All copy and image slots live here, so
 * a page is edited without touching any component.
 *
 * Copy is written from what the product and docs pages describe. Before launch,
 * check every claim against what the product actually does.
 *
 * Stats are product facts, not performance claims, on purpose. Add measured
 * customer results here once you have real numbers.
 *
 * Images: drop the files in /public/images/solutions/ (names below). Until a
 * file exists, the page shows a neutral placeholder instead of a broken image.
 */

export type IconKey =
  | "search" | "filter" | "target" | "gauge" | "mail" | "users" | "database"
  | "shield" | "refresh" | "chart" | "layers" | "zap" | "clock" | "network"
  | "list" | "workflow" | "building" | "send" | "sparkles";

export type SolutionImage = { src: string; alt: string; width: number; height: number };

export type Solution = {
  slug: string;
  /** Short name, used in breadcrumbs, cards and headings. */
  name: string;
  /** One sentence for cards and related-solution lists. */
  short: string;
  eyebrow: string;
  meta: { title: string; description: string };
  hero: { headline: string; subhead: string; image: SolutionImage };
  stats: { value: string; label: string }[];
  challenges: { icon: IconKey; title: string; text: string }[];
  steps: { stage: string; title: string; text: string }[];
  showcase: {
    eyebrow: string;
    title: string;
    text: string;
    points: string[];
    cta: { label: string; href: string };
    image: SolutionImage;
  };
  capabilities: { icon: IconKey; title: string; text: string; href: string }[];
  faqs: { q: string; a: string }[];
};

const IMG = "/solutions";
const HERO = { width: 1600, height: 1000 };
const SHOWCASE = { width: 1400, height: 1000 };

export const SOLUTIONS: Solution[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "sales",
    name: "Sales Teams",
    short: "Qualified, ranked prospects so reps spend their time selling.",
    eyebrow: "For Sales Teams",
    meta: {
      title: "AQSTRA for Sales Teams",
      description:
        "Build focused pipelines with qualified prospects that match your ideal customer profile, and sync them straight to your CRM.",
    },
    hero: {
      headline: "Spend your day selling, not searching",
      subhead:
        "AQSTRA finds, qualifies and ranks prospects that match your ideal customer, so every rep starts the morning with a list worth calling.",
      image: { src: `${IMG}/sales-hero.jpg`, alt: "AQSTRA sales pipeline with leads ranked by score", ...HERO },
    },
    stats: [
      { value: "0–100", label: "Score on every lead" },
      { value: "5", label: "Stages, one workflow" },
      { value: "2-way", label: "Salesforce and HubSpot sync" },
    ],
    challenges: [
      {
        icon: "clock",
        title: "Hours lost to research",
        text: "Reps spend a large share of the week finding and checking leads instead of talking to them.",
      },
      {
        icon: "database",
        title: "Lists full of noise",
        text: "Duplicates, bounced emails and poor-fit accounts bury the prospects who are actually ready.",
      },
      {
        icon: "target",
        title: "No shared definition of qualified",
        text: "Without one, every rep qualifies differently and handoffs between marketing and sales stall.",
      },
    ],
    steps: [
      {
        stage: "Discover",
        title: "Pull every lead into one list",
        text: "Leads from Google, LinkedIn, Facebook and Meta Lead Ads arrive in a single view, each tagged with its source.",
      },
      {
        stage: "Classify",
        title: "Match leads to your ideal customer",
        text: "Industry, company size, region and role are checked automatically against your profile.",
      },
      {
        stage: "Qualify",
        title: "Rank by score",
        text: "Fit and signals combine into a 0–100 score, so the best leads rise to the top.",
      },
      {
        stage: "Outreach",
        title: "Hand off or start a sequence",
        text: "Sync qualified leads to Salesforce or HubSpot, or launch a multi-step campaign in AQSTRA.",
      },
    ],
    showcase: {
      eyebrow: "Built for the daily workflow",
      title: "A ranked list, ready every morning",
      text: "Open AQSTRA and see the leads most likely to convert first, along with the fit and signals behind each score.",
      points: [
        "Search by industry, company size and technology stack",
        "See why a lead scored the way it did",
        "Track prospect engagement and buying signals",
        "Sync to Salesforce or HubSpot without exports",
      ],
      cta: { label: "Explore lead scoring", href: "/product#lead-scoring" },
      image: { src: `${IMG}/sales-showcase.jpg`, alt: "Lead scoring view with fit and signals", ...SHOWCASE },
    },
    capabilities: [
      { icon: "search", title: "Advanced search", text: "Find prospects by industry, company size and technology stack.", href: "/product#lead-discovery" },
      { icon: "gauge", title: "Lead scoring", text: "A 0–100 score on every lead, based on your own criteria.", href: "/product#lead-scoring" },
      { icon: "layers", title: "Classification", text: "Sort leads against your ideal customer profile automatically.", href: "/product#classification" },
      { icon: "shield", title: "Verification", text: "Check contact details before a rep spends time on them.", href: "/product" },
      { icon: "refresh", title: "CRM sync", text: "Push qualified leads to Salesforce or HubSpot.", href: "/product#integrations" },
      { icon: "send", title: "Campaign builder", text: "Launch outreach to your best leads from the same place.", href: "/product#campaign-tools" },
    ],
    faqs: [
      {
        q: "How does AQSTRA decide which leads to prioritize?",
        a: "Every lead gets a score from 0 to 100 that combines fit with your ideal customer profile and recent signals. You choose the criteria, so the ranking reflects how your team actually qualifies.",
      },
      {
        q: "Will it work with the CRM we already use?",
        a: "AQSTRA syncs with Salesforce and HubSpot. Qualified leads, scores and campaign activity move across, and status changes flow back.",
      },
      {
        q: "Where do the leads come from?",
        a: "From the sources you connect, including Google, LinkedIn, Facebook and Meta Lead Ads, all merged into one list.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "business-development",
    name: "Business Development",
    short: "Map accounts and decision makers, and find partners with precision.",
    eyebrow: "For Business Development",
    meta: {
      title: "AQSTRA for Business Development",
      description:
        "Identify partnership opportunities and strategic accounts, and find the right contacts at the right companies.",
    },
    hero: {
      headline: "Find the right accounts, and the right people inside them",
      subhead:
        "Map decision makers, spot partnership-fit companies and keep strategic accounts warm, using data you can trust.",
      image: { src: `${IMG}/business-development-hero.jpg`, alt: "AQSTRA account mapping view", ...HERO },
    },
    stats: [
      { value: "Fit", label: "Scored on every account" },
      { value: "Verified", label: "Contacts before outreach" },
      { value: "Export", label: "Targeted lists on demand" },
    ],
    challenges: [
      {
        icon: "users",
        title: "Unclear org structures",
        text: "It is hard to see who decides, who influences and who blocks inside a target account.",
      },
      {
        icon: "network",
        title: "Partners found by chance",
        text: "Good-fit partners surface through word of mouth instead of a repeatable search.",
      },
      {
        icon: "clock",
        title: "Strategic accounts go quiet",
        text: "Without tracking, warm relationships cool and nobody notices until it is too late.",
      },
    ],
    steps: [
      {
        stage: "Discover",
        title: "Search by what defines a partner",
        text: "Describe the companies you want to work with and AQSTRA finds those that match.",
      },
      {
        stage: "Classify",
        title: "Group accounts by type and fit",
        text: "Separate strategic accounts, partners and prospects so each gets the right approach.",
      },
      {
        stage: "Qualify",
        title: "Score accounts and contacts",
        text: "Rank accounts by fit, and see who the right contact is at each one.",
      },
      {
        stage: "Outreach",
        title: "Export a list or start a campaign",
        text: "Hand a targeted list to your team, sync it to your CRM or begin outreach in AQSTRA.",
      },
    ],
    showcase: {
      eyebrow: "Account mapping",
      title: "See the whole account, not just one contact",
      text: "Understand how an account is structured and where the opportunity is, before the first message goes out.",
      points: [
        "Map organizational structures and decision makers",
        "Identify partnership-fit companies by criteria",
        "Track engagement across strategic accounts",
        "Export targeted lists for outreach campaigns",
      ],
      cta: { label: "Explore classification", href: "/product#classification" },
      image: { src: `${IMG}/business-development-showcase.jpg`, alt: "Accounts grouped by type and fit", ...SHOWCASE },
    },
    capabilities: [
      { icon: "search", title: "Advanced search", text: "Search by the criteria that define a strategic account.", href: "/product#lead-discovery" },
      { icon: "layers", title: "Classification", text: "Group accounts as strategic, partner or prospect.", href: "/product#classification" },
      { icon: "list", title: "List management", text: "Save, segment and export targeted account lists.", href: "/product" },
      { icon: "shield", title: "Verification", text: "Reach decision makers with contact data you can trust.", href: "/product" },
      { icon: "gauge", title: "Lead scoring", text: "Rank accounts by how well they fit your criteria.", href: "/product#lead-scoring" },
      { icon: "refresh", title: "CRM sync", text: "Keep account and contact records aligned in your CRM.", href: "/product#integrations" },
    ],
    faqs: [
      {
        q: "Can I find partners, not only buyers?",
        a: "Yes. Define the criteria that make a company a good partner and AQSTRA classifies and scores accounts against them, the same way it does for buyers.",
      },
      {
        q: "How do I keep strategic accounts from going quiet?",
        a: "Track engagement and signals across the accounts you care about, so you can see which relationships are warm and which need attention.",
      },
      {
        q: "Can I export lists for my own outreach?",
        a: "Yes. Export a targeted list, sync it to your CRM or turn it into a campaign inside AQSTRA.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "growth",
    name: "Growth Teams",
    short: "Repeatable prospecting workflows that turn raw data into pipeline.",
    eyebrow: "For Growth Teams",
    meta: {
      title: "AQSTRA for Growth Teams",
      description:
        "Scale outbound with data-driven prospecting. Build repeatable workflows that turn raw data into qualified opportunities.",
    },
    hero: {
      headline: "Turn raw data into a repeatable growth engine",
      subhead:
        "Build a workflow once, run it every week, and see which segments actually convert.",
      image: { src: `${IMG}/growth-hero.jpg`, alt: "AQSTRA growth dashboard with pipeline quality", ...HERO },
    },
    stats: [
      { value: "5", label: "Stages you can repeat" },
      { value: "Auto", label: "Enrichment and verification" },
      { value: "Live", label: "Pipeline quality tracking" },
    ],
    challenges: [
      {
        icon: "workflow",
        title: "One-off lists, no system",
        text: "Every campaign starts from scratch, so results are hard to repeat or improve.",
      },
      {
        icon: "shield",
        title: "Inconsistent data quality",
        text: "Missing fields and unverified contacts quietly drag down every campaign.",
      },
      {
        icon: "chart",
        title: "Hard to see what works",
        text: "Without clear measurement, it is guesswork which segments deserve more effort.",
      },
    ],
    steps: [
      {
        stage: "Discover",
        title: "Save your discovery workflow",
        text: "Turn the searches and sources that work into a workflow you can run again.",
      },
      {
        stage: "Filter",
        title: "Segment by firmographics and signals",
        text: "Cut the list by company traits and intent signals to build focused segments.",
      },
      {
        stage: "Qualify",
        title: "Enrich, verify and score automatically",
        text: "Missing details are filled in, contacts are checked and every lead is scored.",
      },
      {
        stage: "Outreach",
        title: "Launch and measure",
        text: "Run campaigns and compare reply rates by segment to decide where to double down.",
      },
    ],
    showcase: {
      eyebrow: "Measure what matters",
      title: "See which segments actually convert",
      text: "Connect every stage of the funnel in one place, so you can improve the workflow instead of rebuilding it.",
      points: [
        "Create and save prospecting workflows",
        "Segment by firmographics and intent signals",
        "Automate list enrichment and verification",
        "Measure pipeline quality and conversion rates",
      ],
      cta: { label: "Explore campaign tools", href: "/product#campaign-tools" },
      image: { src: `${IMG}/growth-showcase.jpg`, alt: "Pipeline quality and reply rate charts", ...SHOWCASE },
    },
    capabilities: [
      { icon: "workflow", title: "Saved workflows", text: "Re-run the discovery and filtering steps that work.", href: "/product#lead-discovery" },
      { icon: "database", title: "Data enrichment", text: "Fill in missing company and contact details automatically.", href: "/product" },
      { icon: "shield", title: "Verification", text: "Check contacts before they reach a campaign.", href: "/product" },
      { icon: "list", title: "List management", text: "Segment by firmographics and intent signals.", href: "/product#filtering" },
      { icon: "chart", title: "Pipeline analytics", text: "Measure lead quality and conversion by segment.", href: "/product#lead-scoring" },
      { icon: "send", title: "Campaign builder", text: "Turn a qualified segment into a sequence in minutes.", href: "/product#campaign-tools" },
    ],
    faqs: [
      {
        q: "Can I reuse a workflow across campaigns?",
        a: "Yes. Save your discovery, classification and filtering rules once, then run them whenever you need a fresh list.",
      },
      {
        q: "How is data quality kept high?",
        a: "Enrichment and verification run automatically, and filters remove duplicates and invalid contacts before a lead reaches your list.",
      },
      {
        q: "What can I measure?",
        a: "Pipeline quality, score distribution and campaign reply rates, so you can compare segments and focus on what converts.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "outreach",
    name: "Outreach",
    short: "Structured sequences that start with who is actually ready.",
    eyebrow: "For Outreach",
    meta: {
      title: "AQSTRA for Outreach",
      description:
        "Turn a qualified shortlist into structured, personalized outreach sequences that stop when someone replies.",
    },
    hero: {
      headline: "Outreach that starts with who is actually ready",
      subhead:
        "Turn a qualified shortlist into structured, personalized sequences, and stop them the moment someone replies.",
      image: { src: `${IMG}/outreach-hero.jpg`, alt: "AQSTRA campaign sequence builder", ...HERO },
    },
    stats: [
      { value: "Multi-step", label: "Sequences with timed follow-ups" },
      { value: "Auto-stop", label: "When a lead replies" },
      { value: "Synced", label: "Replies back to your CRM" },
    ],
    challenges: [
      {
        icon: "mail",
        title: "Generic messages",
        text: "When every prospect gets the same email, replies drop and your domain suffers.",
      },
      {
        icon: "shield",
        title: "Sending to cold, unverified lists",
        text: "Bounces damage sender reputation and waste the effort that went into the copy.",
      },
      {
        icon: "refresh",
        title: "Replies lost between tools",
        text: "Answers land in one inbox while the CRM shows something else entirely.",
      },
    ],
    steps: [
      {
        stage: "Filter",
        title: "Clean the audience first",
        text: "Remove duplicates, invalid emails and poor fits before anything is sent.",
      },
      {
        stage: "Qualify",
        title: "Choose who gets the sequence",
        text: "Pick a saved list or a minimum score, so only the best leads are contacted.",
      },
      {
        stage: "Outreach",
        title: "Write and schedule each step",
        text: "Build the messages, use lead fields as placeholders and set the delay between steps.",
      },
      {
        stage: "Sync",
        title: "Track replies and sync results",
        text: "Replies and meetings flow back to AQSTRA and your CRM automatically.",
      },
    ],
    showcase: {
      eyebrow: "Campaign builder",
      title: "Sequences built from lead intelligence",
      text: "Every message starts from what AQSTRA already knows about the lead, so relevance does not depend on manual research.",
      points: [
        "Use lead fields and signals as message placeholders",
        "Set the delay between each step",
        "Stop sequences automatically on reply",
        "Sync replies and meetings to your CRM",
      ],
      cta: { label: "Explore campaign tools", href: "/product#campaign-tools" },
      image: { src: `${IMG}/outreach-showcase.jpg`, alt: "Sequence steps with delays and reply tracking", ...SHOWCASE },
    },
    capabilities: [
      { icon: "send", title: "Campaign builder", text: "Build multi-step sequences with timed follow-ups.", href: "/product#campaign-tools" },
      { icon: "sparkles", title: "Lead-aware messages", text: "Use lead fields and signals as placeholders in every message.", href: "/product#campaign-tools" },
      { icon: "list", title: "List management", text: "Send to saved lists and keep audiences organized.", href: "/product" },
      { icon: "shield", title: "Verification", text: "Clean your audience first to keep bounces low.", href: "/product" },
      { icon: "gauge", title: "Score thresholds", text: "Send only to leads above the score you set.", href: "/product#lead-scoring" },
      { icon: "refresh", title: "CRM sync", text: "Replies and meetings flow back to your CRM.", href: "/product#integrations" },
    ],
    faqs: [
      {
        q: "Can sequences stop when someone replies?",
        a: "Yes. A sequence ends as soon as a lead replies or books a meeting, so nobody gets a follow-up they no longer need.",
      },
      {
        q: "Do I need a separate outreach tool?",
        a: "No, you can build and run sequences in AQSTRA. If you already use Outreach or SalesLoft, you can connect them instead.",
      },
      {
        q: "How do I protect my sender reputation?",
        a: "Verification and filtering clean your audience before anything is sent, which keeps bounces low.",
      },
    ],
  },
];

export const getSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
export const getRelatedSolutions = (slug: string) => SOLUTIONS.filter((s) => s.slug !== slug);

// import type { Metadata } from "next";
// import { getFeedSafe, getIndustriesSafe } from "@/lib/news/server";
// import { ArchiveSection } from "@/components/news/archive-section";
// import { FeaturedSection } from "@/components/news/featured-section";
// import { HeadlineTicker } from "@/components/news/headline-ticker";
// import { HowItWorks } from "@/components/news/how-it-works";
// import { IndiaVsGlobal } from "@/components/news/india-vs-global";
// import { NewsCta } from "@/components/news/news-cta";
// import { NewsHero } from "@/components/news/news-hero";
// import { NewsProvider } from "@/components/news/news-provider";
// import { RollingFeed } from "@/components/news/rolling-feed";
// import { SectionHeading } from "@/components/news/section-heading";
// import { FooterSection } from "@/components/footer";
// import { Navbar } from "@/components/navbar";

// // Rebuilt in the background at most every 5 minutes. Visitors always get a cached page.
// // (Next.js needs this to be a plain number written right here, not imported.)
// export const revalidate = 300;

// export const metadata: Metadata = {
//   title: "Industry News: business signals and what to search next | Aqstra",
//   description: "Global and Indian business news turned into opportunity signals. Each story shows why it matters and the exact searches to run on Aqstra.",
//   alternates: { canonical: "/news" },
//   openGraph: { title: "Industry News | Aqstra", description: "Business signals from India and the world, with the searches to run next.", type: "website", url: "/news" },
// };

// export default async function NewsPage() {
//   const [featured, rolling, india, global, industries] = await Promise.all([
//     getFeedSafe({ section: "featured", limit: 5 }),
//     getFeedSafe({ section: "rolling", limit: 12 }),
//     getFeedSafe({ section: "rolling", scope: "india", limit: 6 }),
//     getFeedSafe({ section: "rolling", scope: "global", limit: 6 }),
//     getIndustriesSafe(),
//   ]);

//   const heroDeck = featured.items.length >= 2 ? featured.items : rolling.items;
//   const newest = [...featured.items, ...rolling.items].map((s) => s.published_at).sort().at(-1) ?? null;
//   const unavailable = !featured.ok && !rolling.ok;
//   // If the database is down while Next rebuilds the page in the background, fail the rebuild:
//   // Next then keeps serving the last good page instead of replacing it with an empty one.
//   // (During `next build` we still render the friendly empty state, so a deploy never fails because of it.)
//   if (unavailable && process.env.NEXT_PHASE !== "phase-production-build") throw new Error("news feed unavailable");

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "CollectionPage",
//     name: "Aqstra Industry News",
//     description: "Business signals from India and the world, with suggested searches.",
//     mainEntity: { "@type": "ItemList", itemListElement: featured.items.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.headline })) },
//   };

//   return (
//     <NewsProvider>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

//       <Navbar /> 
//       <NewsHero deck={heroDeck} updatedAt={newest} industryCount={industries.length} />
//       <HeadlineTicker stories={rolling.items.slice(0, 10)} />

//       <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
//         <HowItWorks />
//         <FeaturedSection stories={featured.items} unavailable={unavailable} />

//         <section aria-labelledby="latest-title" className="py-16">
//           <SectionHeading id="latest-title" eyebrow="Latest signals" title="What's moving now" blurb="Fresh stories from the past week. Filter by region or industry to see only what's relevant to you." />
//           <RollingFeed initial={{ items: rolling.items, next: rolling.next }} industries={industries} />
//         </section>

//         <IndiaVsGlobal india={india.items} global={global.items} />
//         <ArchiveSection />
//         <NewsCta />
//       </div>
//       <FooterSection />
//     </NewsProvider>
//   );
// }





import type { Metadata } from "next";
import { FEATURED_HOURS } from "@/lib/news/config";
import { getFeedSafe, getIndustriesSafe } from "@/lib/news/server";
import { ArchiveSection } from "@/components/news/archive-section";
import { FeaturedSection } from "@/components/news/featured-section";
import { HeadlineTicker } from "@/components/news/headline-ticker";
import { HowItWorks } from "@/components/news/how-it-works";
import { IndiaVsGlobal } from "@/components/news/india-vs-global";
import { NewsCta } from "@/components/news/news-cta";
import { NewsHero } from "@/components/news/news-hero";
import { NewsProvider } from "@/components/news/news-provider";
import { RollingFeed } from "@/components/news/rolling-feed";
import { SectionHeading } from "@/components/news/section-heading";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";

// Rebuilt in the background at most every 5 minutes. Visitors always get a cached page.
// (Next.js needs this to be a plain number written right here, not imported.)
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industry News: business signals and what to search next | Aqstra",
  description: "Global and Indian business news turned into opportunity signals. Each story shows why it matters and the exact searches to run on Aqstra.",
  alternates: { canonical: "/news" },
  openGraph: { title: "Industry News | Aqstra", description: "Business signals from India and the world, with the searches to run next.", type: "website", url: "/news" },
};

export default async function NewsPage() {
  const [featured, rolling, india, global, industries] = await Promise.all([
    getFeedSafe({ section: "featured", limit: 8 }),
    getFeedSafe({ section: "rolling", limit: 12 }),
    getFeedSafe({ section: "rolling", scope: "india", limit: 6 }),
    getFeedSafe({ section: "rolling", scope: "global", limit: 6 }),
    getIndustriesSafe(),
  ]);

  const heroDeck = featured.items.length >= 2 ? featured.items : rolling.items;
  const newest = [...featured.items, ...rolling.items].map((s) => s.published_at).sort().at(-1) ?? null;
  const unavailable = !featured.ok && !rolling.ok;
  const stale = featured.items.length > 0 && featured.items.every((s) => Date.now() - Date.parse(s.published_at) > FEATURED_HOURS * 3_600_000);
  // If the database is down while Next rebuilds the page in the background, fail the rebuild:
  // Next then keeps serving the last good page instead of replacing it with an empty one.
  // (During `next build` we still render the friendly empty state, so a deploy never fails because of it.)
  if (unavailable && process.env.NEXT_PHASE !== "phase-production-build") throw new Error("news feed unavailable");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Aqstra Industry News",
    description: "Business signals from India and the world, with suggested searches.",
    mainEntity: { "@type": "ItemList", itemListElement: featured.items.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.headline })) },
  };

  return (
    <NewsProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <Navbar />
      <NewsHero deck={heroDeck} updatedAt={newest} industryCount={industries.length} />
      <HeadlineTicker stories={rolling.items.slice(0, 10)} />

      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <HowItWorks />
        <FeaturedSection stories={featured.items} unavailable={unavailable} stale={stale} />

        <section aria-labelledby="latest-title" className="py-16">
          <SectionHeading id="latest-title" eyebrow="Latest signals" title="What's moving now" blurb="Fresh stories from the past week. Filter by region or industry to see only what's relevant to you." />
          <RollingFeed initial={{ items: rolling.items, next: rolling.next }} industries={industries} />
        </section>

        <IndiaVsGlobal india={india.items} global={global.items} />
        <ArchiveSection />
        <NewsCta />
      </div>

      <FooterSection />
    </NewsProvider>
  );
}
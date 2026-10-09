import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CtaSection } from "@/components/cta-section";
import { WaveDivider } from "@/components/wave-divider";
import { FooterSection } from "@/components/footer";
import { SolutionHero } from "@/components/solutions/solution-hero";
import {
  RelatedSolutions,
  SolutionCapabilities,
  SolutionChallenges,
  SolutionFaq,
  SolutionShowcase,
  SolutionStats,
  SolutionSteps,
} from "@/components/solutions/solution-sections";
import { SOLUTIONS, getSolution } from "@/lib/solutions";

export const dynamicParams = false;

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return { title: solution.meta.title, description: solution.meta.description };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return (
    <>
      <Navbar />
      <main>
        <SolutionHero solution={solution} />
        <SolutionStats solution={solution} />
        <SolutionChallenges solution={solution} />
        <SolutionSteps solution={solution} />
        <SolutionShowcase solution={solution} />
        <SolutionCapabilities solution={solution} />
        <SolutionFaq solution={solution} />
        <RelatedSolutions slug={solution.slug} />
        <CtaSection />
      </main>
      <WaveDivider />
      <FooterSection />
    </>
  );
}
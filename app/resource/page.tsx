import type { Metadata } from "next";
import { ResourcesHome } from "../../components/resource/resources-home";
import { LatestResources , ResourceTypes } from "@/components/resource/resources-sections";
import { Navbar } from "@/components/navbar";
import { CtaSection } from "@/components/cta-section";
import { FooterSection } from "@/components/footer";


export const metadata: Metadata = {
  title: "Resources — AQstra",
  description:
    "Practical guides, proven strategies, and expert insights to help your team build better pipelines and create more meaningful outreach.",
};

export default function ResourcesPage() {
  return (
    <main>
      <Navbar />
      <ResourcesHome />
      <ResourceTypes />
      <LatestResources />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
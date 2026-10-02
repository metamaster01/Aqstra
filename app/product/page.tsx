import { Navbar } from "@/components/navbar";
import { ProductHero } from "@/components/product/product-hero";
import { LeadDiscoverySection } from "@/components/product/lead-discovery-section";
import { CtaSection } from "@/components/cta-section";
import { FooterSection } from "@/components/footer";
import { ClassificationSection } from "@/components/product/classification-section";
import { FilteringSection } from "@/components/product/filtering-section";
import { LeadScoringSection } from "@/components/product/lead-scoring-section";
import { PlatformCapabilitiesSection } from "@/components/product/platform-capabilities-section";
import { IntegrationsSection } from "@/components/product/integrations-section";

export const metadata = {
  title: "Product — AQstra",
  description:
    "AQstra is a powerful lead discovery and prospecting platform that helps you find better leads, faster.",
};

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductHero />
        <LeadDiscoverySection />
        {/* Classification, Filtering, Lead Scoring, Campaign Tools and
            Integrations sections go here next — the sub-nav above is
            already wired to scroll to #classification, #filtering,
            #lead-scoring, #campaign-tools and #integrations once those
            exist. */}

        <ClassificationSection />
        <FilteringSection />
        <LeadScoringSection />

        <PlatformCapabilitiesSection />
        <IntegrationsSection />
      </main>
      <CtaSection />
      <FooterSection />
    </>
  );
}
import { ProductFeatureSection } from "./product-feature-section";

export function LeadScoringSection() {
  return (
    <ProductFeatureSection
      id="lead-scoring"
      imagePosition="left"
      title="Score and prioritize your best opportunities"
      description="Not all leads are created equal. MetaMaster scores every prospect so your team knows exactly who to contact first."
      checklist={[
        "AI-powered lead scoring based on fit and intent",
        "Custom scoring rules for your business",
        "Track engagement and buying signals",
        "Surface high-intent prospects automatically",
      ]}
      image={{ src: "/products/product-4.png", alt: "Lead Scoring — AI-powered fit and intent scores" }}
    />
  );
}

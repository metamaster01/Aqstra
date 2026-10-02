import { ProductFeatureSection } from "./product-feature-section";

export function FilteringSection() {
  return (
    <ProductFeatureSection
      id="filtering"
      imagePosition="right"
      tone="muted"
      title="Filter out noise and focus on what matters"
      description="Eliminate irrelevant prospects instantly. Smart filtering ensures your team only sees leads worth pursuing."
      checklist={[
        "Exclude by industry, company size, or location",
        "Filter out existing customers and competitors",
        "Remove contacts without verified emails",
        "Save filter presets for repeat searches",
      ]}
      image={{ src: "/products/product-3.png", alt: "Smart Filters — exclude noise and surface relevant prospects" }}
    />
  );
}

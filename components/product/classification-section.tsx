import { ProductFeatureSection } from "./product-feature-section";

export function ClassificationSection() {
  return (
    <ProductFeatureSection
      id="classification"
      imagePosition="left"
      title="Classify and organize prospects automatically"
      description="MetaMaster analyzes every prospect against your criteria, automatically categorizing them so your team knows exactly who to prioritize."
      checklist={[
        "Auto-classify by industry, role, and seniority",
        "Tag prospects based on custom attributes",
        "Group by buying stage and engagement level",
        "Create dynamic segments that update in real-time",
      ]}
      image={{ src: "/products/product-2.png", alt: "Classification Engine — auto-classify and tag prospects" }}
    />
  );
}

import { CtaSection } from "@/components/cta-section";
import { FooterSection } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ComparePlans, PricingFaq, PricingPlans } from "@/components/pricing/pricing-sections";


export const metadata = {
  title: "Pricing — AQstra",
  description:
    "AQstra offers flexible pricing plans to suit your business needs. Choose the plan that fits your team and start discovering better leads today.",
};

export default function PricingPage() {
  return (
    <div>
        <Navbar />
      <PricingPlans />
      <ComparePlans />
      <PricingFaq />
      <CtaSection />

      <FooterSection />
    </div>
  );
}

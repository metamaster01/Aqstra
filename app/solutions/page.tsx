import type { Metadata } from "next";
import { SolutionsHeader } from "../../components/solutions/solutions-header";
import { SolutionsTeams } from "../../components/solutions/solutions-teams";
import { SolutionsUseCases } from "../../components/solutions/solutions-use-cases";
import { SolutionsIndustries } from "../../components/solutions/solutions-industries";
import { Navbar } from "@/components/navbar";
import { CtaSection } from "@/components/cta-section";
import { FooterSection } from "@/components/footer";

export const metadata: Metadata = {
  title: "Solutions — AQstra",
  description:
    "Whether you're in sales, business development, or growth, AQstra adapts to your workflow and helps you find better prospects.",
};

export default function SolutionsPage() {
  return (
    <main>
        <Navbar />
      <SolutionsHeader />
      <SolutionsTeams />
      <SolutionsUseCases />
      <SolutionsIndustries />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
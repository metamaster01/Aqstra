import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { StatsSection } from "@/components/stats-section";
import { ProcessSection } from "@/components/process-section";
import { FeaturesInteractive } from "@/components/features-interactive";
import { ScrollFrameSection } from "@/components/ScrollFrameSection";
import { MacbookShowcase } from "@/components/macbook-showcase";
import { DataFlowSection } from "@/components/data-flow-section";
import { FooterSection } from "@/components/footer";
import { Workflow } from "@/components/workflow-precision";
import { CtaSection } from "@/components/cta-section";
import { WaveDivider } from "@/components/wave-divider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollFrameSection />
        <StatsSection />

        <ProcessSection/>
        <FeaturesInteractive /> 
        <MacbookShowcase />
        <DataFlowSection />
        <Workflow />
        <CtaSection />
      </main>
        <WaveDivider />
      <FooterSection />
    </>
  );
}
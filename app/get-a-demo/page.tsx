import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";
import { RequestSection } from "@/components/demo/request-section";
import { Testimonials } from "@/components/demo/testimonials";
import { TrustedBy } from "@/components/demo/trusted-by";
import { getDemoSession } from "@/lib/demo/session";

export const metadata: Metadata = {
  title: "Get a Demo | AQSTRA",
  description: "See how AQSTRA helps you find, research and prioritize the right prospects. Request your interactive demo.",
};

export default async function GetADemoPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;
  const session = await getDemoSession(); // already have a live demo? offer to continue it

  return (
    <>
      <Navbar />
      <main>
        <RequestSection welcomeBack={session?.firstName} expired={expired === "1" && !session} />
        <TrustedBy />
        <Testimonials />
      </main>
      <FooterSection />
    </>
  );
}

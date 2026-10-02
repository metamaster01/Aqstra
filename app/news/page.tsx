import type { Metadata } from "next";
import { StatusPage } from "@/components/status-page";
import { div } from "framer-motion/client";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";

export const metadata: Metadata = {
  title: "News | Coming soon",
  description: "Product updates, announcements and industry insights are on their way.",
};

export default function NewsPage() {
  return (
    <div>
      <Navbar />
    <StatusPage
      lottieSrc="/lottie/coming-soon.json"
      lottieLabel="Animation of a page that is coming soon"
      badge="Coming soon"
      pulse
      title="News is on its way"
      text="We're putting together product updates, announcements and industry insights. Check back soon, it won't be long."
      links={[{ label: "Browse resources", href: "/resources" }]}
    />

    <FooterSection />
    </ div>
  );
}


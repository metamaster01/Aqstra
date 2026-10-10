import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactSteps } from "@/components/contact/contact-steps";
import { ContactFaq } from "@/components/contact/contact-faq";
import { CONTAINER } from "@/components/solutions/solution-ui";
import { FadeIn } from "@/components/solutions/fade-in";
import { TOPICS, type TopicValue } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us | AQSTRA",
  description: "Questions about AQSTRA, pricing or a demo? Send us a message and we'll get back to you soon.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  // /contact?topic=demo pre-selects that topic (handy for "Book a Demo" buttons).
  const { topic } = await searchParams;
  const defaultTopic: TopicValue = TOPICS.find((t) => t.value === topic)?.value ?? "demo";

  return (
    <>
      <Navbar />
      <main>
        <ContactHero />

        <section className="bg-background pb-14 sm:pb-20">
          <div className={`${CONTAINER} grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12`}>
            {/* Form first on phones, on the right on desktop. id="demo" so "#demo" buttons land here. */}
            <FadeIn className="order-1 scroll-mt-24 lg:order-2">
              <div id="demo" className="scroll-mt-24">
                <ContactForm defaultTopic={defaultTopic} />
              </div>
            </FadeIn>
            <FadeIn delay={0.08} className="order-2 lg:order-1">
              <ContactInfo />
            </FadeIn>
          </div>
        </section>

        <ContactSteps />
        <ContactFaq />
      </main>
      <FooterSection />
    </>
  );
}
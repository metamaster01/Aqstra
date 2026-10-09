import type { Metadata } from "next";
import { LegalPage } from "../../components/legal/legal-page";
import { LEGAL, TERMS } from "../../lib/legal";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";

export const metadata: Metadata = {
  title: `Terms of Service | ${LEGAL.product}`,
  description: `The terms that govern your use of ${LEGAL.product}.`,
};

export default function TermsPage() {
  return (
    <div>
<Navbar />


<LegalPage
  title="Terms of Service"
  intro={`Please read these terms carefully. They set out the rules for using ${LEGAL.product}.`}
  sections={TERMS}
  sibling={{ label: "Privacy Policy", href: "/privacy-policy" }}
/>

<FooterSection />

    </div>
  );
}
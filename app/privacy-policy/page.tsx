import type { Metadata } from "next";
import { LegalPage } from "../../components/legal/legal-page";
import { LEGAL, PRIVACY } from "../../lib/legal";
import { FooterSection } from "../../components/footer";
import { Navbar } from "../../components/navbar";

export const metadata: Metadata = {
  title: `Privacy Policy | ${LEGAL.product}`,
  description: `How ${LEGAL.company} collects, uses and protects personal data.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div>
        <Navbar />
    <LegalPage
      title="Privacy Policy"
      intro="We take your privacy seriously. This policy explains what we collect, why, and the choices you have."
      sections={PRIVACY}
      sibling={{ label: "Terms of Service", href: "/terms" }}
    />

    <FooterSection />   

    </div>
  );
}
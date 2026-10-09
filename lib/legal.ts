/**
 * Legal page content. Edit the LEGAL block first — every page below reads from it.
 *
 * IMPORTANT: this is a well-structured starting draft, not legal advice.
 * Have a lawyer review it (especially jurisdiction, data-protection and
 * liability wording) before you rely on it.
 */

export const LEGAL = {
  company: "MetaMaster",
  product: "AQSTRA",
  website: "aqstra.com",
  supportEmail: "support@aqstra.com", // TODO: confirm real address
  privacyEmail: "privacy@aqstra.com", // TODO: confirm real address
  jurisdiction: "India", // TODO: governing law / courts
  updated: "October 8, 2026",
} as const;

export type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] };
export type LegalSection = { id: string; title: string; blocks: Block[] };

const { company: C, product: P, website: W } = LEGAL;

/* -------------------------------------------------------------------------- */
/*  Terms of Service                                                          */
/* -------------------------------------------------------------------------- */

export const TERMS: LegalSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of these terms",
    blocks: [
      {
        kind: "p",
        text: `These Terms of Service ("Terms") govern your access to and use of ${P}, a lead intelligence platform provided by ${C} ("we", "us", "our"), including ${W} and any related apps, tools and services (together, the "Service").`,
      },
      {
        kind: "p",
        text: `By creating an account or using the Service you agree to these Terms. If you use the Service on behalf of a company, you confirm that you have authority to bind that company, and "you" includes it. If you do not agree, do not use the Service.`,
      },
    ],
  },
  {
    id: "service",
    title: "2. The Service",
    blocks: [
      {
        kind: "p",
        text: `${P} helps teams discover, classify, filter and score leads and run outreach campaigns. We may add, change or remove features over time. Where a change materially reduces functionality you have paid for, we will give reasonable notice.`,
      },
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts and security",
    blocks: [
      {
        kind: "ul",
        items: [
          "You must provide accurate information and keep it up to date.",
          "You are responsible for all activity under your account and for keeping your credentials secure.",
          "Tell us promptly if you suspect unauthorized access.",
          "You must be at least 18 years old, or the age of majority where you live, to use the Service.",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable use",
    blocks: [
      { kind: "p", text: "You agree not to use the Service to:" },
      {
        kind: "ul",
        items: [
          "break any law, including anti-spam, marketing, privacy and data-protection laws that apply to your outreach;",
          "send unsolicited messages without a lawful basis, or ignore opt-out requests;",
          "collect or process personal data without a lawful basis or in breach of a third-party platform's terms;",
          "upload malware, or attempt to disrupt, probe or gain unauthorized access to the Service or its systems;",
          "scrape, reverse engineer or resell the Service, except as these Terms allow;",
          "infringe anyone's intellectual property or other rights.",
        ],
      },
      {
        kind: "p",
        text: "We may suspend or restrict access if we reasonably believe these rules are being broken or the Service is being put at risk.",
      },
    ],
  },
  {
    id: "your-data",
    title: "5. Your data",
    blocks: [
      {
        kind: "p",
        text: `You keep ownership of the content and lead data you submit or connect to the Service ("Customer Data"). You give us a limited licence to host, process and display it only to provide, secure and improve the Service and as described in our Privacy Policy.`,
      },
      {
        kind: "p",
        text: "You are responsible for having the rights and lawful basis to collect, upload and use Customer Data, and for the content of any messages you send through the Service.",
      },
    ],
  },
  {
    id: "third-party",
    title: "6. Third-party services and integrations",
    blocks: [
      {
        kind: "p",
        text: "The Service can connect to third-party tools such as lead sources, CRMs and outreach platforms. Your use of those services is governed by their own terms. We are not responsible for third-party services, and changes they make may affect how an integration works.",
      },
    ],
  },
  {
    id: "fees",
    title: "7. Fees and payment",
    blocks: [
      {
        kind: "ul",
        items: [
          "Paid plans are billed in advance for the period you choose, unless the order says otherwise.",
          "Fees are non-refundable except where the law requires or we state otherwise in writing.",
          "You are responsible for applicable taxes.",
          "We will give notice before changing prices; changes apply from your next billing period.",
        ],
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "8. Intellectual property",
    blocks: [
      {
        kind: "p",
        text: `${C} and its licensors own the Service, including its software, design, trademarks and documentation. We grant you a limited, non-exclusive, non-transferable right to use the Service for your internal business purposes while these Terms are in force.`,
      },
      {
        kind: "p",
        text: "If you send us feedback or suggestions, we may use them without obligation to you.",
      },
    ],
  },
  {
    id: "termination",
    title: "9. Suspension and termination",
    blocks: [
      {
        kind: "p",
        text: "You can stop using the Service and close your account at any time. We may suspend or terminate your access for material breach of these Terms, non-payment, or legal or security reasons. After termination we will make Customer Data available for export for a reasonable period, then delete it in line with our Privacy Policy.",
      },
    ],
  },
  {
    id: "disclaimers",
    title: "10. Disclaimers",
    blocks: [
      {
        kind: "p",
        text: `The Service is provided "as is" and "as available". To the fullest extent the law permits, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose and non-infringement. Lead scores, classifications and other outputs are decision aids; we do not guarantee their accuracy or any business result.`,
      },
    ],
  },
  {
    id: "liability",
    title: "11. Limitation of liability",
    blocks: [
      {
        kind: "p",
        text: `To the fullest extent the law permits, ${C} will not be liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue, data or goodwill. Our total liability for any claim relating to the Service is limited to the amount you paid us in the twelve months before the event giving rise to the claim. Nothing in these Terms limits liability that cannot be limited by law.`,
      },
    ],
  },
  {
    id: "indemnity",
    title: "12. Indemnity",
    blocks: [
      {
        kind: "p",
        text: "You agree to defend and indemnify us against third-party claims arising from your Customer Data, your use of the Service in breach of these Terms, or your outreach activity, including claims under marketing and data-protection laws.",
      },
    ],
  },
  {
    id: "changes",
    title: "13. Changes to these terms",
    blocks: [
      {
        kind: "p",
        text: "We may update these Terms from time to time. If a change is material, we will notify you by email or in the Service before it takes effect. Continued use after the effective date means you accept the updated Terms.",
      },
    ],
  },
  {
    id: "governing-law",
    title: "14. Governing law",
    blocks: [
      {
        kind: "p",
        text: `These Terms are governed by the laws of ${LEGAL.jurisdiction}, without regard to conflict-of-law rules. The courts of ${LEGAL.jurisdiction} have exclusive jurisdiction over disputes, unless mandatory law gives you the right to bring a claim elsewhere.`,
      },
    ],
  },
  {
    id: "contact",
    title: "15. Contact",
    blocks: [
      {
        kind: "p",
        text: `Questions about these Terms? Email us at ${LEGAL.supportEmail}.`,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Privacy Policy                                                            */
/* -------------------------------------------------------------------------- */

export const PRIVACY: LegalSection[] = [
  {
    id: "overview",
    title: "1. Overview",
    blocks: [
      {
        kind: "p",
        text: `This Privacy Policy explains how ${C} ("we", "us") collects, uses and shares personal data when you visit ${W} or use ${P} (the "Service"), and the choices you have.`,
      },
      {
        kind: "p",
        text: `Two roles matter here. For information about our own website visitors and account holders, we act as the controller. For lead and contact data that our customers upload or connect to the Service, we act as a processor (or service provider) on the customer's behalf, and the customer decides why and how that data is used.`,
      },
    ],
  },
  {
    id: "data-we-collect",
    title: "2. Data we collect",
    blocks: [
      {
        kind: "ul",
        items: [
          "Account data: name, work email, company, role and password (stored hashed).",
          "Billing data: plan, invoices and payment details handled by our payment processor; we do not store full card numbers.",
          "Customer Data: leads, contacts, lists, campaigns and notes you upload, or import from connected sources and tools.",
          "Usage data: pages viewed, features used, device, browser, IP address and approximate location.",
          "Communications: messages you send us and your marketing preferences.",
          "Cookies and similar technologies, described in the Cookies section below.",
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    title: "3. How we use data",
    blocks: [
      {
        kind: "ul",
        items: [
          "To provide, operate and secure the Service, including discovery, classification, filtering, scoring and campaigns.",
          "To create and manage accounts, take payment and provide support.",
          "To improve and develop the Service, and to analyze how it is used.",
          "To send service messages and, where permitted, product updates and marketing.",
          "To detect abuse and fraud, and to meet legal obligations.",
        ],
      },
      {
        kind: "p",
        text: "Where the law requires a legal basis, we rely on performance of a contract, our legitimate interests (such as securing and improving the Service), your consent (for example for optional cookies or marketing), and legal obligation.",
      },
    ],
  },
  {
    id: "sharing",
    title: "4. How we share data",
    blocks: [
      { kind: "p", text: "We do not sell your personal data. We share it only with:" },
      {
        kind: "ul",
        items: [
          "Service providers that help us run the Service, such as hosting, storage, analytics, email and payment providers, under contracts that limit their use of the data.",
          "Third-party tools you choose to connect, such as your CRM or outreach platform, as directed by you.",
          "Professional advisers, and authorities where the law requires.",
          "A successor, if we are involved in a merger, acquisition or sale of assets, with notice to you.",
        ],
      },
    ],
  },
  {
    id: "retention",
    title: "5. Retention",
    blocks: [
      {
        kind: "p",
        text: "We keep personal data only as long as needed for the purposes above. Account data is kept while your account is active. When an account is closed, we delete or anonymize Customer Data within a reasonable period, except where we must keep information for legal, tax or security reasons. Backups are overwritten on a rolling schedule.",
      },
    ],
  },
  {
    id: "security",
    title: "6. Security",
    blocks: [
      {
        kind: "p",
        text: "We use technical and organizational measures such as encryption in transit, access controls and monitoring to protect personal data. No system is completely secure, so we cannot guarantee absolute security. Tell us promptly if you believe your account has been compromised.",
      },
    ],
  },
  {
    id: "transfers",
    title: "7. International transfers",
    blocks: [
      {
        kind: "p",
        text: "We and our providers may process data in countries other than your own. Where required, we use appropriate safeguards, such as standard contractual clauses, for transfers of personal data.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "8. Your rights",
    blocks: [
      {
        kind: "p",
        text: "Depending on where you live, you may have the right to:",
      },
      {
        kind: "ul",
        items: [
          "access the personal data we hold about you and receive a copy;",
          "correct inaccurate data, or have it deleted;",
          "object to or restrict certain processing, and withdraw consent at any time;",
          "data portability;",
          "opt out of marketing messages using the link in any email;",
          "complain to your local data-protection authority.",
        ],
      },
      {
        kind: "p",
        text: `To exercise a right, email ${LEGAL.privacyEmail}. If your data was uploaded by one of our customers, we may refer your request to that customer, as they control that data.`,
      },
    ],
  },
  {
    id: "cookies",
    title: "9. Cookies",
    blocks: [
      {
        kind: "p",
        text: "We use cookies and similar technologies to keep you signed in, remember preferences such as your theme, measure usage and improve the Service. You can control cookies in your browser settings; blocking some of them may affect how the Service works.",
      },
    ],
  },
  {
    id: "children",
    title: "10. Children",
    blocks: [
      {
        kind: "p",
        text: "The Service is intended for businesses and is not directed at children. We do not knowingly collect personal data from anyone under 16. If you believe a child has given us data, contact us and we will delete it.",
      },
    ],
  },
  {
    id: "changes",
    title: "11. Changes to this policy",
    blocks: [
      {
        kind: "p",
        text: `We may update this policy from time to time. The "Last updated" date at the top shows the latest version, and we will notify you of material changes by email or in the Service.`,
      },
    ],
  },
  {
    id: "contact",
    title: "12. Contact us",
    blocks: [
      {
        kind: "p",
        text: `Questions or requests about privacy? Email ${LEGAL.privacyEmail}.`,
      },
    ],
  },
];

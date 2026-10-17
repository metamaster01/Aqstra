import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";
import { DemoExperience } from "@/components/demo/demo-experience";
import { getDemoSession } from "@/lib/demo/session";

export const metadata: Metadata = {
  title: "Interactive Demo | AQSTRA",
  robots: { index: false, follow: false }, // a gated page: keep it out of search results
};

export default async function DemoPage() {
  const session = await getDemoSession();
  if (!session) redirect("/get-a-demo"); // the demo opens after the request form

  return (
    <>
      <Navbar />
      <main>
        <DemoExperience firstName={session.firstName} />
      </main>
      <FooterSection />
    </>
  );
}
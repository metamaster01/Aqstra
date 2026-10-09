import { Navbar } from "@/components/navbar";
import { ResourcesHome } from "../../components/resource/resources-home";
import { getFeaturedResources, getLatestResources } from "../../lib/queries";
import { FooterSection } from "@/components/footer";

export default async function ResourcesPage() {
  const [{ main, side }, latest] = await Promise.all([
    getFeaturedResources(),
    getLatestResources({ limit: 9 }), // the "only show a handful" cap
  ]);

  return (
    <div>
      <Navbar />
      <ResourcesHome main={main} side={side} latest={latest} />
      <FooterSection />
    </div>
  );
}
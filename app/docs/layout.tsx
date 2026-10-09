import type { ReactNode } from "react";
import { getCategoryTree, getDocsNavPages } from "../../lib/queries";
import { DocsSidebar } from "../../components/docs/docs-sidebar";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const [tree, pages] = await Promise.all([getCategoryTree("docs"), getDocsNavPages()]);

  return (
    <div>
    <Navbar />
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 py-6 sm:px-10 lg:grid-cols-[240px_1fr] lg:gap-12 lg:py-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-10">
          <DocsSidebar tree={tree} pages={pages} />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
      <FooterSection />
      </div>
  );
}

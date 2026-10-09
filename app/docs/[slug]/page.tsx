import { notFound } from "next/navigation";
import { getPageBySlug, getPageSections } from "../../../lib/queries";
import { SectionRenderer } from "../../../components/docs/section-renderer";
import { DocsToc } from "../../../components/docs/docs-toc";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page || page.type !== "Doc") notFound();

  const sections = await getPageSections(page.id);

  return (
    
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_220px]">
      <article className="max-w-[720px]">
        {page.category && (
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">{page.category}</p>
        )}
        <h1 className="mt-2 font-display text-[32px] font-extrabold tracking-[-0.02em] text-foreground sm:text-[38px]">
          {page.title}
        </h1>
        {page.description && (
          <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{page.description}</p>
        )}

        <div className="mt-10">
          <SectionRenderer sections={sections} />
        </div>
      </article>

      <aside className="hidden xl:block">
        <DocsToc sections={sections} />
      </aside>
    </div>
      
  );
}

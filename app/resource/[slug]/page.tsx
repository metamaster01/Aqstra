import { notFound } from "next/navigation";
import Image from "next/image";
import { getPageBySlug, getPageSections } from "../../../lib/queries";
import { SectionRenderer } from "../../../components/docs/section-renderer";
import { DocsToc } from "../../../components/docs/docs-toc";
import { Navbar } from "@/components/navbar";
import { FooterSection } from "@/components/footer";

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page || page.type === "Doc") notFound();

  const sections = await getPageSections(page.id);

  return (
    <div>
      <Navbar />
    <div className="mx-auto max-w-[1100px] px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-[720px] text-center">
        <span className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-primary">
          {page.tag ?? page.type}
        </span>
        <h1 className="mt-4 font-display text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[40px]">
          {page.title}
        </h1>
        {page.description && (
          <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-relaxed text-muted">{page.description}</p>
        )}
        <p className="mt-5 flex items-center justify-center gap-2.5 text-xs text-muted">
          <span>{page.readTime}</span>
          {page.category && (
            <>
              <span aria-hidden className="size-1 rounded-full bg-muted/40" />
              <span>{page.category}</span>
            </>
          )}
        </p>
      </div>

      {page.cover && (
        <div className="relative mx-auto mt-10 aspect-[16/7] w-full max-w-[920px] overflow-hidden rounded-2xl border border-border">
          <Image
            src={page.cover}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 920px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mx-auto mt-12 grid max-w-[720px] grid-cols-1 gap-10 xl:max-w-none xl:grid-cols-[1fr_220px]">
        <div className="mx-auto w-full max-w-[720px]">
          <SectionRenderer sections={sections} />
        </div>
        <aside className="hidden xl:block">
          <DocsToc sections={sections} />
        </aside>
      </div>
    </div>
    <FooterSection />
    </div>
  );
}
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getCategoriesWithCounts, type Area } from "@/lib/admin/queries";
import { CategoryManager } from "@/components/admin/category-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Categories" };

const TABS: { area: Area; label: string; hint: string }[] = [
  { area: "docs", label: "Docs sidebar", hint: "The groups in the documentation sidebar. Groups can nest." },
  { area: "resource", label: "Resource topics", hint: "The topics shown on resource cards, like Lead Generation." },
];

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  await requireAdmin("/admin/categories");
  const { area: raw } = await searchParams;
  const area: Area = raw === "resource" ? "resource" : "docs";
  const tab = TABS.find((t) => t.area === area)!;

  const items = await getCategoriesWithCounts(area);

  return (
    <>
      <PageHeader title="Categories" description={tab.hint} />

      <div role="tablist" aria-label="Category type" className="mb-6 inline-flex rounded-xl border border-border bg-card p-1">
        {TABS.map((t) => (
          <Link
            key={t.area}
            role="tab"
            aria-selected={t.area === area}
            href={`/admin/categories?area=${t.area}`}
            className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              t.area === area ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <CategoryManager key={area} area={area} items={items} />
    </>
  );
}

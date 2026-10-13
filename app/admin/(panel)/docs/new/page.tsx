import { PageEditor } from "@/components/admin/editor/page-editor";
import { requireAdmin } from "@/lib/admin/auth";
import { UUID } from "@/lib/admin/db";
import { blankPage } from "@/lib/admin/editor-types";
import { getCategoryOptions } from "@/lib/admin/queries";

export const metadata = { title: "New doc page" };

export default async function NewDocPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  await requireAdmin("/admin/docs/new");
  const { category } = await searchParams;
  const categories = await getCategoryOptions("docs");
  const preset = category && UUID.test(category) && categories.some((c) => c.id === category) ? category : "";

  return (
    <PageEditor
      key="new"
      area="docs"
      initial={{ page: blankPage("docs", preset), sections: [], updatedAt: null }}
      categories={categories}
    />
  );
}

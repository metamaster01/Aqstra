import { PageEditor } from "@/components/admin/editor/page-editor";
import { requireAdmin } from "@/lib/admin/auth";
import { UUID } from "@/lib/admin/db";
import { blankPage } from "@/lib/admin/editor-types";
import { getCategoryOptions } from "@/lib/admin/queries";

export const metadata = { title: "New resource page" };

export default async function NewResourcePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  await requireAdmin("/admin/resources/new");
  const { category } = await searchParams;
  const categories = await getCategoryOptions("resource");
  const preset = category && UUID.test(category) && categories.some((c) => c.id === category) ? category : "";

  return (
    <PageEditor
      key="new"
      area="resource"
      initial={{ page: blankPage("resource", preset), sections: [], updatedAt: null }}
      categories={categories}
    />
  );
}

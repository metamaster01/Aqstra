import { notFound, redirect } from "next/navigation";
import { PageEditor } from "@/components/admin/editor/page-editor";
import { requireAdmin } from "@/lib/admin/auth";
import { UUID } from "@/lib/admin/db";
import { getCategoryOptions, getEditorData } from "@/lib/admin/queries";

export const metadata = { title: "Edit page" };

export default async function EditDocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/docs/${id}`);
  if (!UUID.test(id)) notFound();

  const data = await getEditorData(id);
  if (!data) notFound();
  // Opened under the wrong section? Send it to the right editor.
  if (data.page.type !== "Doc") redirect(`/admin/resources/${id}`);

  const categories = await getCategoryOptions("docs");

  // The key includes updated_at, so "load latest" after a conflict remounts the editor with fresh data.
  return <PageEditor key={`${id}:${data.updatedAt}`} area="docs" initial={data} categories={categories} />;
}

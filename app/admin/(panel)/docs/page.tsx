import { requireAdmin } from "@/lib/admin/auth";
import { AdminPagesList } from "@/components/admin/pages-list";

export const metadata = { title: "Docs" };

export default async function AdminDocsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin("/admin/docs");
  return <AdminPagesList area="docs" searchParams={await searchParams} />;
}

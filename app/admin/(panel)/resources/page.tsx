import { requireAdmin } from "@/lib/admin/auth";
import { AdminPagesList } from "@/components/admin/pages-list";

export const metadata = { title: "Resources" };

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin("/admin/resources");
  return <AdminPagesList area="resource" searchParams={await searchParams} />;
}

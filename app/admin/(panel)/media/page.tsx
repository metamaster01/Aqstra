import { requireAdmin } from "@/lib/admin/auth";
import { MediaManager } from "@/components/admin/media/media-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requireAdmin("/admin/media");
  return (
    <>
      <PageHeader
        title="Media"
        description="Images and videos for your docs and resources. Files are stored in your R2 bucket and served from the media domain."
      />
      <MediaManager />
    </>
  );
}

import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastProvider } from "@/components/admin/toast";
import { requireAdmin } from "@/lib/admin/auth";

/** Everything inside (panel) requires an admin. This check never goes away. */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <ToastProvider>
      <AdminShell admin={{ email: admin.email, role: admin.role }}>{children}</AdminShell>
    </ToastProvider>
  );
}

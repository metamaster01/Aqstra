import type { Metadata } from "next";
import type { ReactNode } from "react";

// Everything under /admin: never indexed, never cached.
export const metadata: Metadata = {
  title: { default: "Admin | AQSTRA", template: "%s | AQSTRA Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}

"use client";

import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The admin panel is a working tool, not a showcase: native scrolling feels
  // faster there and keeps inner scroll areas (tables, dialogs) normal.
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
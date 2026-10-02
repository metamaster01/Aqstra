import type { Metadata } from "next";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = {
  title: "Page not found",
};

// Next.js renders this for any URL that doesn't match a route (and when you call notFound()).
// It automatically responds with a real 404 status code.
export default function NotFound() {
  return (
    <StatusPage
      lottieSrc="/lottie/404-error.json"
      lottieLabel="Animation showing a 404 error"
      badge="Error 404"
      title="Page not found"
      text="The page you're looking for doesn't exist or may have been moved. Let's get you back on track."
      links={[
        { label: "Pricing", href: "/pricing" },
        { label: "Resources", href: "/resources" },
        { label: "News", href: "/news" },
      ]}
    />
  );
}

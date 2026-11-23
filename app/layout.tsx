import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { SmoothScroll } from "@/providers/smooth-scroll";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aqstra — Find the right leads. Build smarter outreach.",
  description:
    "Aqstra helps you discover, classify, and filter prospects for accuracy, then turn your qualified shortlist into structured outreach campaigns. Discover relevant business prospects with Aqstra. Explore AI-powered lead discovery, intelligent filtering and business intelligence to simplify B2B prospecting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-svh">
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
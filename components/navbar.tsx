"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resource" },
  { label: "Pricing", href: "/pricing" },
  { label: "Industry News", href: "/news" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "border-border/70" : "border-transparent dark:border-border/60"
      } bg-background/80`}
    >
      <nav className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-20" aria-label="Main">
        <Link href="/" className="font-display text-[19px] font-extrabold tracking-tight" aria-label="AQSTRA home">
          AQSTRA
        </Link>

        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="text-[13px] font-medium text-foreground/85 transition-colors hover:text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg border border-transparent px-3.5 py-2 text-[13px] font-medium transition-colors hover:text-primary dark:border-foreground/70 dark:hover:border-primary"
          >
            Log in
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            Book a Demo <ArrowRight className="size-3.5" />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-lg border border-border"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-border/60 bg-background lg:hidden"
          >
            <ul className="flex flex-col px-6 py-4 sm:px-10">
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[15px] font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3 flex gap-3">
                <Link href="/login" className="flex-1 rounded-lg border border-border py-2.5 text-center text-sm font-medium">
                  Log in
                </Link>
                <Link href="#demo" className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white">
                  Book a Demo
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

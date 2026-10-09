// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { AnimatePresence, motion } from "framer-motion";
// import { ArrowRight, Menu, X } from "lucide-react";
// import { ThemeToggle } from "./theme-toggle";

// const links = [
//   { label: "Product", href: "/product" },
//   { label: "Solutions", href: "/solutions" },
//   { label: "Resources", href: "/resources" },
//   { label: "Pricing", href: "/pricing" },
//   { label: "Industry News", href: "/news" },
//   { label : "Contact Us", href: "/contact" }
// ];

// export function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [open]);

//   return (
//     <header
//       className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
//         scrolled ? "border-border/70" : "border-transparent dark:border-border/60"
//       } bg-background/80`}
//     >
//       <nav className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-20" aria-label="Main">
//         <Link href="/" className="font-display text-[19px] font-extrabold tracking-tight" aria-label="AQSTRA home">
//           AQSTRA
//         </Link>

//         <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
//           {links.map((l) => (
//             <li key={l.label}>
//               <Link href={l.href} className="text-[13px] font-medium text-foreground/85 transition-colors hover:text-primary">
//                 {l.label}
//               </Link>
//             </li>
//           ))}
//         </ul>

//         <div className="hidden items-center gap-3 lg:flex">
//           <Link
//             href="/login"
//             className="rounded-lg border border-transparent px-3.5 py-2 text-[13px] font-medium transition-colors hover:text-primary dark:border-foreground/70 dark:hover:border-primary"
//           >
//             Log in
//           </Link>
//           <Link
//             href="#demo"
//             className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
//           >
//             Book a Demo <ArrowRight className="size-3.5" />
//           </Link>
//           <ThemeToggle />
//         </div>

//         <div className="flex items-center gap-3 lg:hidden">
//           <ThemeToggle />
//           <button
//             type="button"
//             aria-label={open ? "Close menu" : "Open menu"}
//             aria-expanded={open}
//             onClick={() => setOpen((v) => !v)}
//             className="flex size-9 items-center justify-center rounded-lg border border-border"
//           >
//             {open ? <X className="size-4" /> : <Menu className="size-4" />}
//           </button>
//         </div>
//       </nav>

//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             className="overflow-hidden border-t border-border/60 bg-background lg:hidden"
//           >
//             <ul className="flex flex-col px-6 py-4 sm:px-10">
//               {links.map((l) => (
//                 <li key={l.label}>
//                   <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[15px] font-medium">
//                     {l.label}
//                   </Link>
//                 </li>
//               ))}
//               <li className="mt-3 flex gap-3">
//                 <Link href="/login" className="flex-1 rounded-lg border border-border py-2.5 text-center text-sm font-medium">
//                   Log in
//                 </Link>
//                 <Link href="#demo" className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white">
//                   Book a Demo
//                 </Link>
//               </li>
//             </ul>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }








"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  Library,
  Menu,
  PenLine,
  Play,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

type SubLink = { label: string; desc: string; href: string; icon: LucideIcon };
type NavLink = { label: string; href: string; children?: SubLink[] };

/** Each item lands on its own category page: docs, or the resource list pre-filtered by type. */
const RESOURCE_MENU: SubLink[] = [
  { label: "Documentation", desc: "Setup, features and how-tos", href: "/docs", icon: Library },
  { label: "Guides", desc: "In-depth prospecting playbooks", href: "/resource/all?type=Guide", icon: BookOpen },
  { label: "Articles", desc: "Ideas on sales intelligence", href: "/resource/all?type=Article", icon: FileText },
  { label: "Videos", desc: "Walkthroughs and webinars", href: "/resource/all?type=Video", icon: Play },
  { label: "Blog", desc: "News and notes from the team", href: "/resource/all?type=Blog", icon: PenLine },
];

const links: NavLink[] = [
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources", children: RESOURCE_MENU },
  { label: "Pricing", href: "/pricing" },
  { label: "Industry News", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

const LINK_CLASS = "text-[13px] font-medium text-foreground/85 transition-colors hover:text-primary";

/* -------------------------------------------------------------------------- */
/*  Desktop dropdown                                                          */
/* -------------------------------------------------------------------------- */

function DesktopDropdown({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  // Close after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return (
    <li
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div className="flex items-center gap-0.5">
        <Link href={link.href} className={LINK_CLASS}>
          {link.label}
        </Link>
        <button
          type="button"
          aria-label={`${link.label} menu`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-5 place-items-center rounded text-foreground/70 transition-colors hover:text-primary"
        >
          <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          // The pt-3 gap is part of the hover area, so the menu doesn't close while the cursor crosses it.
          <div className="absolute left-1/2 top-full z-50 w-[330px] -translate-x-1/2 pt-3">
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-background p-2 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]"
            >
              {link.children!.map(({ label, desc, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  role="menuitem"
                  className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-foreground/5"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold text-foreground">{label}</span>
                    <span className="block text-xs text-muted">{desc}</span>
                  </span>
                </Link>
              ))}
              <Link
                href={link.href}
                role="menuitem"
                className="mt-1 flex items-center justify-between rounded-xl border-t border-border px-3 pb-1.5 pt-3 text-[13px] font-semibold text-primary"
              >
                Browse all resources
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                    */
/* -------------------------------------------------------------------------- */

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setSubOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "border-border/70" : "border-transparent dark:border-border/60"
      } bg-background/80`}
    >
      <nav
        className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-20"
        aria-label="Main"
      >
        <Link href="/" className="font-display text-[19px] font-extrabold tracking-tight" aria-label="AQSTRA home">
          AQSTRA
        </Link>

        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {links.map((l) =>
            l.children ? (
              <DesktopDropdown key={l.label} link={l} />
            ) : (
              <li key={l.label}>
                <Link href={l.href} className={LINK_CLASS}>
                  {l.label}
                </Link>
              </li>
            )
          )}
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
            className="max-h-[calc(100vh-58px)] overflow-y-auto border-t border-border/60 bg-background lg:hidden"
          >
            <ul className="flex flex-col px-6 py-4 sm:px-10">
              {links.map((l) =>
                l.children ? (
                  <li key={l.label}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="block flex-1 py-3 text-[15px] font-medium"
                      >
                        {l.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={`${l.label} menu`}
                        aria-expanded={subOpen}
                        onClick={() => setSubOpen((v) => !v)}
                        className="grid size-9 place-items-center rounded-lg text-foreground/70"
                      >
                        <ChevronDown className={`size-4 transition-transform duration-200 ${subOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {subOpen && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden border-l border-border pl-4"
                        >
                          {l.children.map(({ label, href, icon: Icon }) => (
                            <li key={label}>
                              <Link
                                href={href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2.5 py-2.5 text-[14px] text-foreground/85"
                              >
                                <Icon className="size-4 text-primary" aria-hidden />
                                {label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[15px] font-medium">
                      {l.label}
                    </Link>
                  </li>
                )
              )}
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
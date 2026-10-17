"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminNav, type NavCounts } from "./admin-nav";
import { Badge, btn } from "./ui";

function Brand() {
  return (
    <Link href="/admin" className="font-display text-[17px] font-extrabold tracking-tight">
      AQSTRA <span className="font-medium text-muted">Admin</span>
    </Link>
  );
}

function SidebarBody({ counts }: { counts?: NavCounts }) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center px-5">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AdminNav counts={counts} />
      </div>
      <div className="shrink-0 border-t border-border p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-foreground/75 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ExternalLink className="size-[17px]" aria-hidden /> View site
        </a>
      </div>
    </>
  );
}

export function AdminShell({
  admin,
  counts,
  children,
}: {
  admin: { email: string; role: string };
  counts?: NavCounts;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll and allow Esc while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-foreground/[0.025]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-border bg-background lg:flex">
        <SidebarBody counts={counts} />
      </aside>

      {/* Mobile drawer */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        inert={!open}
        aria-label="Menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-background shadow-2xl transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-muted hover:bg-foreground/5"
        >
          <X className="size-4" />
        </button>
        <SidebarBody counts={counts} />
      </aside>

      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid size-9 place-items-center rounded-lg border border-border"
            >
              <Menu className="size-4" />
            </button>
            <Brand />
          </div>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <span className="hidden max-w-[200px] truncate text-[13px] text-muted md:block">{admin.email}</span>
            <Badge tone="info">{admin.role}</Badge>
            <form action={signOut}>
              <button type="submit" className={btn("secondary", "sm")}>
                <LogOut className="size-3.5" aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

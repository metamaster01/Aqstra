"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderTree, Images, LayoutDashboard, Newspaper, type LucideIcon } from "lucide-react";

type Item = { label: string; href: string; icon: LucideIcon };

// Add an entry here when a new admin section ships. Only sections that exist are listed.
const GROUPS: { title: string; items: Item[] }[] = [
  { title: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "Content",
    items: [
      { label: "Docs", href: "/admin/docs", icon: BookOpen },
      { label: "Resources", href: "/admin/resources", icon: Newspaper },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Media", href: "/admin/media", icon: Images },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <nav aria-label="Admin" className="space-y-6">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted/80">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary dark:text-[#9db8ff]"
                        : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-[17px]" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

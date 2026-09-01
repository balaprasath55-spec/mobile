"use client";

import { usePathname } from "next/navigation";
import { AdminLink } from "@/components/admin/admin-link";
import { ClipboardList, LayoutDashboard, Inbox, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/repairs", label: "Jobs", icon: ClipboardList },
  { href: "/dealers", label: "Dealers", icon: Store },
  { href: "/enquiries", label: "Inbox", icon: Inbox },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden dark:border-white/10 dark:bg-navy-900/95">
      <ul className="mx-auto flex max-w-lg items-end justify-around px-1 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <AdminLink
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium",
                  active ? "text-navy dark:text-white" : "text-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    active && "bg-navy/5 dark:bg-white/10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {item.label}
              </AdminLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

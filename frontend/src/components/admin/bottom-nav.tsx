"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, PlusCircle, Users, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/repairs/new", label: "New", icon: PlusCircle, primary: true },
  { href: "/repairs", label: "Jobs", icon: ClipboardList },
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
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium",
                  item.primary
                    ? "text-accent"
                    : active
                      ? "text-navy dark:text-white"
                      : "text-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    item.primary && "bg-accent text-white shadow-soft",
                    !item.primary && active && "bg-navy/5 dark:bg-white/10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

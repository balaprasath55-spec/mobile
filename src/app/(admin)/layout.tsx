import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminBottomNav } from "@/components/admin/bottom-nav";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/repairs/new", label: "New job" },
  { href: "/customers", label: "Customers" },
  { href: "/repairs", label: "Jobs" },
  { href: "/enquiries", label: "Enquiries" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-navy/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800 md:block">
          <Link href="/dashboard" className="font-display text-sm font-semibold text-navy dark:text-white">
            MR Admin
          </Link>
          <nav className="mt-6 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-navy/5 hover:text-navy dark:hover:bg-white/10 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="mt-8 block text-xs text-accent">
            ← View site
          </Link>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-navy/5 bg-white/95 px-4 backdrop-blur dark:border-white/10 dark:bg-navy-800/95 md:h-14">
            <Link href="/dashboard" className="font-display text-sm font-semibold text-navy md:hidden dark:text-white">
              MR Admin
            </Link>
            <p className="ml-auto truncate text-xs text-muted md:text-sm">{session.user?.email}</p>
          </header>
          <div className="flex-1 p-3 pb-24 md:p-6 md:pb-6">{children}</div>
          <AdminBottomNav />
        </div>
      </div>
    </div>
  );
}

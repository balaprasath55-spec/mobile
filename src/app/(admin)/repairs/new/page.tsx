import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { QuickJobForm } from "@/components/admin/quick-job-form";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New job" };

export default async function NewRepairPage({
  searchParams,
}: {
  searchParams: { name?: string; phone?: string; issue?: string; device?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
        New job
      </h1>
      <p className="mt-1 text-sm text-muted">
        Only name, phone, issue &amp; photo are required.
      </p>
      <div className="mt-5">
        <QuickJobForm
          defaults={{
            name: searchParams.name,
            phone: searchParams.phone,
            issue: searchParams.issue,
            device: searchParams.device,
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { AdminLink } from "@/components/admin/admin-link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { RepairForm } from "@/components/admin/repair-form";
import { StatusWorkflow } from "@/components/admin/status-workflow";
import { JobStatusBadge } from "@/components/admin/job-status-badge";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { Button } from "@/components/ui/button";
import { getLocalRepairBundle } from "@/lib/demo-local";
import type { DemoCustomer, DemoRepair } from "@/lib/demo-store";
import { formatIntakeSummary, normalizeRepairIntakeChecks } from "@/lib/repair-intake";
import type { CatalogBrand, CatalogModel } from "@/lib/server-api";
import { formatINR } from "@/lib/utils";

export function RepairDetailView({
  repair,
  customer,
  brands,
  initialModels = [],
  local = false,
}: {
  repair: DemoRepair;
  customer: DemoCustomer;
  brands: CatalogBrand[];
  initialModels?: CatalogModel[];
  local?: boolean;
}) {
  const intakeSummary = formatIntakeSummary(normalizeRepairIntakeChecks(repair.intakeChecks));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm text-accent">{repair.jobId}</p>
          <h1 className="mt-1 font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
            {repair.issue}
          </h1>
          <p className="mt-1 text-sm text-muted">
            <AdminLink href={`/customers/${repair.customerId}`} className="text-accent hover:underline">
              {customer.name}
            </AdminLink>{" "}
            · <a href={`tel:${customer.phone}`} className="text-accent">{customer.phone}</a>
            <span className="block sm:inline"> · {format(new Date(repair.createdAt), "dd MMM yyyy HH:mm")}</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <JobStatusBadge status={repair.status} />
            {repair.dealerId ? (
              <AdminLink
                href={`/dealers/${repair.dealerId}`}
                className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                Dealer job
              </AdminLink>
            ) : null}
          </div>
        </div>
        <div className="w-full text-left text-sm sm:w-auto sm:text-right">
          <p className="text-muted">Amount</p>
          <p className="font-display text-2xl font-semibold text-navy dark:text-white">
            {repair.amount != null ? formatINR(repair.amount) : "N/A"}
          </p>
          <p className="mt-1 text-muted">Advance {formatINR(repair.advancePaid)}</p>
          <Button asChild size="sm" variant="outline" className="mt-3 w-full sm:w-auto">
            <AdminLink href={`/customers/${repair.customerId}/print?jobId=${repair.id}`} target="_blank">
              Print receipt
            </AdminLink>
          </Button>
          {!local ? (
            <DeleteConfirmButton
              url={`/api/repairs/${repair.id}`}
              confirmMessage={`Delete job ${repair.jobId}? This removes it from the database permanently.`}
              label="Delete job"
              successRedirect="/repairs"
              variant="outline"
              className="mt-2 w-full sm:w-auto"
            />
          ) : null}
        </div>
      </div>

      {repair.imageUrl ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-navy dark:text-white">Photo</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={repair.imageUrl}
            alt="Device issue"
            className="max-h-72 w-full rounded-2xl object-cover soft-shadow md:max-w-md"
          />
        </section>
      ) : null}

      {intakeSummary.length > 0 ? (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-navy dark:text-white">Intake checklist</h2>
          <ul className="flex flex-wrap gap-2">
            {intakeSummary.map((item) => (
              <li
                key={item}
                className="rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-medium text-navy dark:border-white/10 dark:bg-navy-800 dark:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <StatusWorkflow repairId={repair.id} status={repair.status} local={local} />

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-navy dark:text-white">Edit job</h2>
        <RepairForm
          customerId={repair.customerId}
          brands={brands}
          initialModels={initialModels}
          repairId={repair.id}
          local={local}
          initial={{
            issue: repair.issue,
            deviceBrandRaw: repair.deviceBrandRaw,
            deviceModelRaw: repair.deviceModelRaw,
            modelId: repair.modelId,
            imei: repair.imei,
            amount: repair.amount,
            advancePaid: repair.advancePaid,
            notes: repair.notes,
            intakeChecks: normalizeRepairIntakeChecks(repair.intakeChecks),
          }}
        />
      </section>
    </div>
  );
}

/** Loads a job from localStorage when Amplify server memory does not have it. */
export function LocalRepairDetail({ id }: { id: string }) {
  const [bundle, setBundle] = useState<ReturnType<typeof getLocalRepairBundle>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBundle(getLocalRepairBundle(id));
    setReady(true);
  }, [id]);

  if (!ready) {
    return <p className="text-sm text-muted">Loading job…</p>;
  }
  if (!bundle) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-muted dark:bg-navy-800">
        Job not found.{" "}
        <AdminLink href="/dashboard" className="text-accent">
          Create a new job
        </AdminLink>
      </div>
    );
  }

  return <RepairDetailView repair={bundle.repair} customer={bundle.customer} brands={[]} local />;
}

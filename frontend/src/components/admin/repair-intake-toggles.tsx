"use client";

import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import type { RepairIntakeChecks } from "@/lib/repair-intake";
import { cn } from "@/lib/utils";

type Props = {
  value: RepairIntakeChecks;
  onChange: (next: RepairIntakeChecks) => void;
  className?: string;
};

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-sm text-navy dark:text-white">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border-t border-navy/10 pt-3 first:border-t-0 first:pt-0 dark:border-white/10">
      {title ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      ) : null}
      {children}
    </div>
  );
}

export function RepairIntakeToggles({ value, onChange, className }: Props) {
  function set<K extends keyof RepairIntakeChecks>(key: K, next: boolean) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-navy/10 bg-white p-4 dark:border-white/10 dark:bg-navy-800",
        className
      )}
    >
      <Section>
        <ToggleRow label="Face ID working" checked={value.faceIdWorking} onCheckedChange={(v) => set("faceIdWorking", v)} />
        <ToggleRow label="Frame bend" checked={value.frameBend} onCheckedChange={(v) => set("frameBend", v)} />
        <ToggleRow label="Display blank" checked={value.displayBlank} onCheckedChange={(v) => set("displayBlank", v)} />
        <ToggleRow label="Sim tray" checked={value.simTray} onCheckedChange={(v) => set("simTray", v)} />
        <ToggleRow label="S-pen" checked={value.sPen} onCheckedChange={(v) => set("sPen", v)} />
        <ToggleRow
          label="Mobile courier from shop (dealer)"
          checked={value.mobileCourierFromShop}
          onCheckedChange={(v) => set("mobileCourierFromShop", v)}
        />
      </Section>

      <Section title="If fold and flip">
        <ToggleRow label="Fold / flip device" checked={value.foldAndFlip} onCheckedChange={(v) => set("foldAndFlip", v)} />
        {value.foldAndFlip ? (
          <>
            <ToggleRow
              label="Inner display condition"
              checked={value.innerDisplayOk}
              onCheckedChange={(v) => set("innerDisplayOk", v)}
            />
            <ToggleRow
              label="Outer display condition"
              checked={value.outerDisplayOk}
              onCheckedChange={(v) => set("outerDisplayOk", v)}
            />
          </>
        ) : null}
      </Section>

      <Section>
        <ToggleRow
          label="Pending mobiles alert once in 3 days"
          checked={value.pendingAlert3Days}
          onCheckedChange={(v) => set("pendingAlert3Days", v)}
        />
      </Section>

      <Section title="Delivery detail">
        <ToggleRow label="Cash" checked={value.paymentCash} onCheckedChange={(v) => set("paymentCash", v)} />
        <ToggleRow label="GPay" checked={value.paymentGpay} onCheckedChange={(v) => set("paymentGpay", v)} />
        <ToggleRow
          label="Courier delivery"
          checked={value.deliveryCourier}
          onCheckedChange={(v) => set("deliveryCourier", v)}
        />
        <ToggleRow label="Hand delivery" checked={value.deliveryHand} onCheckedChange={(v) => set("deliveryHand", v)} />
      </Section>
    </div>
  );
}

"use client";

import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";

export function DeleteCustomerButton({
  customerId,
  customerName,
  repairCount,
}: {
  customerId: string;
  customerName: string;
  repairCount: number;
}) {
  const cascade = repairCount > 0;
  const confirmMessage = cascade
    ? `Delete ${customerName} and all ${repairCount} repair job(s)? This cannot be undone.`
    : `Delete customer ${customerName}? This cannot be undone.`;

  return (
    <DeleteConfirmButton
      url={`/api/customers/${customerId}${cascade ? "?cascade=true" : ""}`}
      confirmMessage={confirmMessage}
      label={cascade ? "Delete customer & jobs" : "Delete customer"}
      successRedirect="/customers"
      variant="outline"
    />
  );
}

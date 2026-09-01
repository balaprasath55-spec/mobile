import type { PriceLine, PriceVariant } from "@/lib/price-estimator-data";
import { formatINR } from "@/lib/utils";

export function formatPriceValue(line: Pick<PriceLine, "min" | "max" | "fixed" | "note">): string {
  if (line.note === "from" && line.min != null) return `From ${formatINR(line.min)}`;
  if (line.fixed != null) return formatINR(line.fixed);
  if (line.min != null && line.max != null) return `${formatINR(line.min)} – ${formatINR(line.max)}`;
  if (line.min != null) return `From ${formatINR(line.min)}`;
  if (line.max != null) return `Up to ${formatINR(line.max)}`;
  return "—";
}

export function formatVariantPrice(variant: PriceVariant): string {
  if (variant.fixed != null) return formatINR(variant.fixed);
  if (variant.min != null && variant.max != null) return `${formatINR(variant.min)} – ${formatINR(variant.max)}`;
  if (variant.min != null) return `From ${formatINR(variant.min)}`;
  return "—";
}

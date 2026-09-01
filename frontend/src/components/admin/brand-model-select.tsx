"use client";

import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { CatalogBrand, CatalogModel } from "@/lib/server-api";

const selectClass =
  "h-12 w-full rounded-2xl border border-navy/10 bg-white px-4 text-base text-navy dark:border-white/10 dark:bg-navy-800 dark:text-white";

type Props = {
  brands: CatalogBrand[];
  /** Preloaded models for the initial brand (edit forms). */
  initialModels?: CatalogModel[];
  defaultBrandName?: string | null;
  defaultModelName?: string | null;
  defaultBrandId?: string;
  defaultModelId?: string;
  required?: boolean;
  className?: string;
};

function resolveInitialBrandId(
  brands: CatalogBrand[],
  defaultBrandId: string,
  defaultBrandName?: string | null,
  defaultModelId?: string
) {
  if (defaultBrandId) return defaultBrandId;
  const fromModel = (defaultModelId?.match(/^model_(brand_[a-z0-9]+)_\d+$/) || [])[1];
  if (fromModel) return fromModel;
  if (defaultBrandName) {
    const match = brands.find((b) => b.name.toLowerCase() === defaultBrandName.toLowerCase());
    if (match) return match.id;
  }
  return "";
}

function resolveInitialModelId(models: CatalogModel[], defaultModelId: string, defaultModelName?: string | null) {
  if (defaultModelId && models.some((m) => m.id === defaultModelId)) return defaultModelId;
  if (defaultModelName) {
    const match = models.find((m) => m.name.toLowerCase() === defaultModelName.toLowerCase());
    if (match) return match.id;
  }
  return defaultModelId && models.some((m) => m.id === defaultModelId) ? defaultModelId : "";
}

export function BrandModelSelect({
  brands,
  initialModels = [],
  defaultBrandName,
  defaultModelName,
  defaultBrandId = "",
  defaultModelId = "",
  required = false,
  className,
}: Props) {
  const initialBrandId = useMemo(
    () => resolveInitialBrandId(brands, defaultBrandId, defaultBrandName, defaultModelId),
    [brands, defaultBrandId, defaultBrandName, defaultModelId]
  );

  const [models, setModels] = useState<CatalogModel[]>(initialModels);
  const [brandId, setBrandId] = useState(initialBrandId);
  const [modelId, setModelId] = useState(() =>
    resolveInitialModelId(initialModels, defaultModelId, defaultModelName)
  );
  const [loadingModels, setLoadingModels] = useState(false);

  async function onBrandChange(nextBrandId: string) {
    setBrandId(nextBrandId);
    setModelId("");
    if (!nextBrandId) {
      setModels([]);
      return;
    }
    setLoadingModels(true);
    try {
      const res = await apiFetch(`/api/models?brandId=${encodeURIComponent(nextBrandId)}`);
      const data = await res.json();
      setModels(data.models ?? []);
    } finally {
      setLoadingModels(false);
    }
  }

  const brandName = brands.find((b) => b.id === brandId)?.name ?? "";
  const modelName = models.find((m) => m.id === modelId)?.name ?? "";

  return (
    <div className={className ?? "grid gap-3 sm:grid-cols-2"}>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-navy dark:text-white">
          Brand {required ? <span className="text-red-500">*</span> : <span className="text-muted">(optional)</span>}
        </span>
        <select
          className={selectClass}
          value={brandId}
          required={required}
          onChange={(e) => onBrandChange(e.target.value)}
        >
          <option value="">Select brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-navy dark:text-white">
          Model {required ? <span className="text-red-500">*</span> : <span className="text-muted">(optional)</span>}
        </span>
        <select
          className={selectClass}
          value={modelId}
          required={required}
          disabled={!brandId || loadingModels}
          onChange={(e) => setModelId(e.target.value)}
        >
          <option value="">
            {!brandId ? "Select brand first" : loadingModels ? "Loading…" : "Select model"}
          </option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>

      <input type="hidden" name="modelId" value={modelId} />
      <input type="hidden" name="deviceBrandRaw" value={brandName} />
      <input type="hidden" name="deviceModelRaw" value={modelName} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Brand = { id: string; name: string };
type Model = { id: string; name: string; brandId: string };

const selectClass =
  "h-12 w-full rounded-2xl border border-navy/10 bg-white px-4 text-base text-navy dark:border-white/10 dark:bg-navy-800 dark:text-white";

type Props = {
  /** Optional: preselect by brand/model name */
  defaultBrandName?: string | null;
  defaultModelName?: string | null;
  /** Optional: preselect by catalog ids */
  defaultBrandId?: string;
  defaultModelId?: string;
  required?: boolean;
  className?: string;
};

export function BrandModelSelect({
  defaultBrandName,
  defaultModelName,
  defaultBrandId = "",
  defaultModelId = "",
  required = false,
  className,
}: Props) {
  const inferredBrandId =
    defaultBrandId ||
    (defaultModelId.match(/^model_(brand_[a-z0-9]+)_\d+$/) || [])[1] ||
    "";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [brandId, setBrandId] = useState(inferredBrandId);
  const [modelId, setModelId] = useState(defaultModelId);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list: Brand[] = data.brands ?? [];
        setBrands(list);
        if (!brandId && defaultBrandName) {
          const match = list.find((b) => b.name.toLowerCase() === defaultBrandName.toLowerCase());
          if (match) setBrandId(match.id);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBrands(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!brandId) {
      setModels([]);
      setModelId("");
      return;
    }
    setLoadingModels(true);
    fetch(`/api/models?brandId=${encodeURIComponent(brandId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list: Model[] = data.models ?? [];
        setModels(list);
        if (defaultModelName) {
          const match = list.find((m) => m.name.toLowerCase() === defaultModelName.toLowerCase());
          if (match) setModelId(match.id);
          else if (!list.some((m) => m.id === modelId)) setModelId("");
        } else if (!list.some((m) => m.id === modelId)) {
          setModelId("");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

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
          disabled={loadingBrands}
          onChange={(e) => {
            setBrandId(e.target.value);
            setModelId("");
          }}
        >
          <option value="">{loadingBrands ? "Loading…" : "Select brand"}</option>
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

      {/* Submitted with the parent form */}
      <input type="hidden" name="modelId" value={modelId} />
      <input type="hidden" name="deviceBrandRaw" value={brandName} />
      <input type="hidden" name="deviceModelRaw" value={modelName} />
    </div>
  );
}

import { cache } from "react";
import { apiUrl } from "@/lib/api-client";

/** Server-side fetch to the Express backend. Deduped per request via React.cache. */
export const serverApi = cache(async function serverApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = typeof data.error === "string" ? data.error : `API ${res.status}`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
});

export type CatalogBrand = { id: string; name: string };
export type CatalogModel = { id: string; name: string; brandId: string };

export async function fetchCatalogBrands() {
  const data = await serverApi<{ brands: CatalogBrand[] }>("/api/brands");
  return data.brands ?? [];
}

export async function fetchCatalogModels(brandId: string) {
  if (!brandId) return [];
  const data = await serverApi<{ models: CatalogModel[] }>(
    `/api/models?brandId=${encodeURIComponent(brandId)}`
  );
  return data.models ?? [];
}

export function inferBrandIdFromModelId(modelId: string | null | undefined): string {
  if (!modelId) return "";
  return (modelId.match(/^model_(brand_[a-z0-9]+)_\d+$/) || [])[1] ?? "";
}

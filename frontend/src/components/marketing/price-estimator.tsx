"use client";

import { apiUrl } from "@/lib/api-client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Brand = { id: string; name: string };
type Model = { id: string; name: string };
type Issue = { id: string; name: string };

export function PriceEstimator() {
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [brandId, setBrandId] = useState(searchParams.get("brandId") ?? "");
  const [modelId, setModelId] = useState(searchParams.get("modelId") ?? "");
  const [issueId, setIssueId] = useState("");
  const [estimate, setEstimate] = useState<{ priceMin: number; priceMax: number } | null>(null);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingBrands(true);
    fetch(apiUrl("/api/brands")).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error("brands");
        if (!cancelled) setBrands(data.brands ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load brands. Refresh and try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadingBrands(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Always load full issue list so the Issue dropdown is usable
    fetch(apiUrl("/api/issues")).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error("issues");
        if (!cancelled) setIssues(data.issues ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load issues. Refresh and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!brandId) {
      setModels([]);
      setModelId("");
      setIssueId("");
      setEstimate(null);
      return;
    }

    setLoadingModels(true);
    setModelId("");
    setIssueId("");
    setEstimate(null);

    fetch(apiUrl(`/api/models?brandId=${encodeURIComponent(brandId)}`))
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "models");
        if (!cancelled) setModels(data.models ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setModels([]);
          setError("Could not load models for that brand.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });

    return () => {
      cancelled = true;
    };
    // intentionally only brandId — model/issue reset is handled here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  useEffect(() => {
    if (!modelId || !issueId) {
      setEstimate(null);
      return;
    }
    let cancelled = false;
    setLoadingEstimate(true);
    fetch(apiUrl(`/api/estimate?modelId=${encodeURIComponent(modelId)}&issueId=${encodeURIComponent(issueId)}`))
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          if (!cancelled) setEstimate(null);
          return;
        }
        if (!cancelled) {
          setEstimate({ priceMin: Number(data.priceMin), priceMax: Number(data.priceMax) });
        }
      })
      .catch(() => {
        if (!cancelled) setEstimate(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingEstimate(false);
      });
    return () => {
      cancelled = true;
    };
  }, [modelId, issueId]);

  const enquiryHref = useMemo(() => {
    const brand = brands.find((b) => b.id === brandId)?.name ?? "";
    const model = models.find((m) => m.id === modelId)?.name ?? "";
    const issue = issues.find((i) => i.id === issueId)?.name ?? "";
    const params = new URLSearchParams();
    if (brand || model) params.set("device", `${brand} ${model}`.trim());
    if (issue) params.set("issue", issue);
    return `/enquiry?${params.toString()}`;
  }, [brandId, modelId, issueId, brands, models, issues]);

  const selectClass =
    "h-12 w-full appearance-auto rounded-2xl border border-navy/10 bg-white px-4 text-base text-navy dark:border-white/10 dark:bg-navy-800 dark:text-white";

  return (
    <div className="rounded-2xl bg-white p-4 soft-shadow dark:bg-navy-800 sm:p-6 md:p-8">
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-2 block font-medium text-muted">Brand</span>
          <select
            className={selectClass}
            value={brandId}
            disabled={loadingBrands}
            onChange={(e) => {
              setError(null);
              setBrandId(e.target.value);
            }}
          >
            <option value="">{loadingBrands ? "Loading brands…" : "Select brand"}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-medium text-muted">Model</span>
          <select
            className={selectClass}
            value={modelId}
            disabled={!brandId || loadingModels}
            onChange={(e) => {
              setError(null);
              setModelId(e.target.value);
              setIssueId("");
            }}
          >
            <option value="">
              {!brandId
                ? "Select brand first"
                : loadingModels
                  ? "Loading models…"
                  : models.length === 0
                    ? "No models found"
                    : "Select model"}
            </option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-medium text-muted">Issue</span>
          <select
            className={selectClass}
            value={issueId}
            disabled={!modelId || issues.length === 0}
            onChange={(e) => {
              setError(null);
              setIssueId(e.target.value);
            }}
          >
            <option value="">
              {!modelId ? "Select model first" : issues.length === 0 ? "Loading issues…" : "Select issue"}
            </option>
            {issues.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-xs text-muted md:hidden">
        Tip: choose Brand → Model → Issue (in that order).
      </p>

      <div className="mt-8 min-h-[100px] rounded-2xl bg-surface p-6 text-center dark:bg-navy-900">
        {loadingEstimate ? <p className="text-muted">Calculating…</p> : null}
        {!loadingEstimate && estimate ? (
          <div>
            <p className="text-sm text-muted">Estimated repair range</p>
            <p className="mt-2 break-words font-display text-2xl font-semibold text-navy dark:text-white sm:text-3xl md:text-4xl">
              {formatINR(estimate.priceMin)} – {formatINR(estimate.priceMax)}
            </p>
            <p className="mt-2 text-xs text-muted">Final quote after free diagnosis. Parts &amp; labour included in range.</p>
            <Button asChild className="mt-5" variant="accent">
              <Link href={enquiryHref}>Submit enquiry</Link>
            </Button>
          </div>
        ) : null}
        {!loadingEstimate && !estimate ? (
          <p className="text-muted">Select brand, model, and issue to see pricing.</p>
        ) : null}
      </div>
    </div>
  );
}

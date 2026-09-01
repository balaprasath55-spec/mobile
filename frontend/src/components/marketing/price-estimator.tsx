"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Battery,
  ChevronDown,
  Cpu,
  Monitor,
  PanelTop,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PRICE_ESTIMATOR_BRANDS,
  type EstimatorModel,
  type PriceLine,
} from "@/lib/price-estimator-data";
import { getModelImage, getSeriesImage } from "@/lib/price-estimator-images";
import { formatPriceValue, formatVariantPrice } from "@/lib/price-estimator-format";
import { cn } from "@/lib/utils";

function DeviceThumbnail({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-navy-900",
        className
      )}
    >
      <Image src={src} alt={alt} width={48} height={48} className="h-full w-full object-contain p-0.5" />
    </span>
  );
}

function RowDivider({ accent }: { accent?: boolean }) {
  return (
    <span
      className={cn(
        "mx-1 h-9 w-px shrink-0",
        accent ? "bg-white/35" : "bg-navy/15 dark:bg-white/20"
      )}
      aria-hidden
    />
  );
}

function lineIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("battery")) return Battery;
  if (lower.includes("motherboard")) return Cpu;
  if (lower.includes("glass")) return PanelTop;
  if (lower.includes("screen") || lower.includes("display")) return Monitor;
  return Smartphone;
}

function PriceTable({ model, imageSrc }: { model: EstimatorModel; imageSrc: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white dark:border-white/10 dark:bg-navy-800">
      <div className="border-b border-navy/10 bg-surface/60 px-4 py-4 dark:border-white/10 dark:bg-navy-900/60">
        <div className="flex items-center gap-3">
          <DeviceThumbnail src={imageSrc} alt={model.name} />
          <RowDivider />
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-navy dark:text-white">{model.name}</h3>
            {model.code ? (
              <span className="mt-1 inline-block rounded-full border border-navy/15 px-2 py-0.5 text-xs text-muted dark:border-white/15">
                {model.code}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] border-b border-navy/10 bg-surface/40 text-[11px] font-semibold uppercase tracking-wide text-muted dark:border-white/10 dark:bg-navy-900/40">
        <div className="px-4 py-2.5">Spare part name</div>
        <div className="px-4 py-2.5 text-right">Price (₹)</div>
      </div>

      <ul>
        {model.lines.map((line, idx) => (
          <PriceRow key={`${line.name}-${idx}`} line={line} />
        ))}
      </ul>

      <div className="border-t border-navy/10 bg-surface/30 px-4 py-3 text-xs text-muted dark:border-white/10 dark:bg-navy-900/30">
        Indicative range from MR Mobile Zone. Final quote after inspection.
      </div>
    </div>
  );
}

function PriceRow({ line }: { line: PriceLine }) {
  const Icon = lineIcon(line.name);

  if (line.note === "Contact for quote") {
    return (
      <li className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-navy/5 px-4 py-3 last:border-b-0 dark:border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface dark:bg-navy-900">
            <Icon className="h-4 w-4 text-muted" />
          </span>
          <span className="text-sm font-medium text-navy dark:text-white">{line.name}</span>
        </div>
        <span className="text-sm text-muted">Contact for quote</span>
      </li>
    );
  }

  if (line.variants?.length) {
    return (
      <li className="border-b border-navy/5 px-4 py-3 last:border-b-0 dark:border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface dark:bg-navy-900">
            <Icon className="h-4 w-4 text-muted" />
          </span>
          <span className="text-sm font-medium text-navy dark:text-white">{line.name}</span>
        </div>
        <ul className="mt-2 space-y-1.5 pl-12">
          {line.variants.map((v) => (
            <li key={v.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">{v.name}</span>
              <span className="shrink-0 font-medium text-navy dark:text-white">{formatVariantPrice(v)}</span>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-navy/5 px-4 py-3 last:border-b-0 dark:border-white/5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface dark:bg-navy-900">
          <Icon className="h-4 w-4 text-muted" />
        </span>
        <span className="text-sm font-medium text-navy dark:text-white">{line.name}</span>
      </div>
      <span className="shrink-0 text-sm font-semibold text-navy dark:text-white">{formatPriceValue(line)}</span>
    </li>
  );
}

export function PriceEstimator() {
  const [brandId, setBrandId] = useState(PRICE_ESTIMATOR_BRANDS[0]?.id ?? "");
  const [openSeriesId, setOpenSeriesId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const pricePanelRef = useRef<HTMLDivElement>(null);

  const brand = PRICE_ESTIMATOR_BRANDS.find((b) => b.id === brandId) ?? PRICE_ESTIMATOR_BRANDS[0];

  const selectedModel = useMemo(() => {
    if (!selectedModelId) return null;
    for (const series of brand.series) {
      const model = series.models.find((m) => m.id === selectedModelId);
      if (model) return { model, seriesId: series.id };
    }
    return null;
  }, [brand, selectedModelId]);

  const selectedModelImage = selectedModel
    ? getModelImage(selectedModel.model.id, selectedModel.seriesId)
    : null;

  function selectBrand(nextBrandId: string) {
    setBrandId(nextBrandId);
    setOpenSeriesId(null);
    setSelectedModelId(null);
  }

  function toggleSeries(seriesId: string) {
    setOpenSeriesId((current) => (current === seriesId ? null : seriesId));
    setSelectedModelId(null);
  }

  function selectModel(model: EstimatorModel) {
    setSelectedModelId(model.id);
  }

  useEffect(() => {
    if (!selectedModelId) return;
    const timer = window.setTimeout(() => {
      pricePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [selectedModelId]);

  const enquiryHref = useMemo(() => {
    if (!selectedModel) return "/enquiry";
    const params = new URLSearchParams();
    params.set("device", `${brand.name} ${selectedModel.model.name}`);
    params.set("issue", "Repair price enquiry");
    return `/enquiry?${params.toString()}`;
  }, [brand.name, selectedModel]);

  return (
    <div className="space-y-6">
      {/* Brand tabs */}
      <div className="flex flex-wrap gap-2">
        {PRICE_ESTIMATOR_BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => selectBrand(b.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              brandId === b.id
                ? "bg-navy text-white dark:bg-white dark:text-navy"
                : "bg-surface text-muted hover:bg-navy/5 dark:bg-navy-900 dark:hover:bg-white/10"
            )}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Series + model picker */}
        <div className={cn("space-y-3", selectedModel && "order-2 lg:order-none")}>
          {brand.series.map((series) => {
            const isOpen = openSeriesId === series.id || brand.series.length === 1;
            return (
              <div
                key={series.id}
                className="overflow-hidden rounded-2xl border border-navy/10 bg-white dark:border-white/10 dark:bg-navy-800"
              >
                <button
                  type="button"
                  onClick={() => brand.series.length > 1 && toggleSeries(series.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left",
                    isOpen ? "bg-accent text-white" : "bg-white text-navy dark:bg-navy-800 dark:text-white"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <DeviceThumbnail
                      src={getSeriesImage(series.id)}
                      alt={series.name}
                      className={isOpen ? "bg-white/15" : undefined}
                    />
                    <RowDivider accent={isOpen} />
                    <span className="font-medium">Select {series.name}</span>
                  </span>
                  {brand.series.length > 1 ? (
                    <ChevronDown className={cn("h-5 w-5 shrink-0 transition", isOpen && "rotate-180")} />
                  ) : null}
                </button>

                {isOpen ? (
                  <ul className="divide-y divide-navy/5 dark:divide-white/5">
                    {series.models.map((model) => (
                      <li key={model.id}>
                        <button
                          type="button"
                          onClick={() => selectModel(model)}
                          className={cn(
                            "flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-surface dark:hover:bg-navy-900",
                            selectedModelId === model.id && "bg-accent/10"
                          )}
                        >
                          <DeviceThumbnail
                            src={getModelImage(model.id, series.id)}
                            alt={model.name}
                            className="bg-surface dark:bg-navy-900"
                          />
                          <RowDivider />
                          <span className="text-sm font-medium text-navy dark:text-white">{model.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Price table — moves above picker on mobile when a model is selected */}
        <div
          ref={pricePanelRef}
          className={cn("scroll-mt-24", selectedModel && "order-1 lg:order-none")}
        >
          {selectedModel && selectedModelImage ? (
            <div className="space-y-4">
              <PriceTable model={selectedModel.model} imageSrc={selectedModelImage} />
              <Button asChild variant="accent" className="w-full min-h-11">
                <Link href={enquiryHref}>Get exact quote — submit enquiry</Link>
              </Button>
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-surface/50 p-8 text-center text-sm text-muted dark:border-white/15 dark:bg-navy-900/40">
              Select a model to see all available repair prices — back door, battery, display, and more.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

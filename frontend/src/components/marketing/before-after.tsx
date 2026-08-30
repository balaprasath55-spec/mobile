"use client";

import { useRef, useState } from "react";

/**
 * Back-glass before/after pair (same angle).
 * Labels can be omitted when the image already includes them.
 */
export function BeforeAfterSlider({
  beforeSrc = "/gallery/before-display.jpg",
  afterSrc = "/gallery/after-display.jpg",
  beforeLabel = "",
  afterLabel = "",
  alt = "Back glass repair before and after",
}: {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}) {
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  function update(clientX: number, el: HTMLDivElement) {
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, next)));
  }

  return (
    <div
      className="relative aspect-square w-full cursor-ew-resize touch-pan-y overflow-hidden rounded-2xl bg-white select-none soft-shadow sm:aspect-[5/4]"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        (e.currentTarget as HTMLDivElement).style.touchAction = "none";
        update(e.clientX, e.currentTarget);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        update(e.clientX, e.currentTarget);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        (e.currentTarget as HTMLDivElement).style.touchAction = "";
      }}
      onPointerCancel={(e) => {
        dragging.current = false;
        (e.currentTarget as HTMLDivElement).style.touchAction = "";
      }}
      role="img"
      aria-label={alt}
    >
      {/* Before — real cracked phone on repair mat */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      {beforeLabel ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
      ) : null}

      {/* After */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />
        {afterLabel ? (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {afterLabel}
          </span>
        ) : null}
      </div>

      <div className="absolute inset-y-0 z-20 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-navy text-white shadow-lg">
          <span className="text-sm leading-none" aria-hidden>
            ↔
          </span>
        </div>
      </div>
    </div>
  );
}

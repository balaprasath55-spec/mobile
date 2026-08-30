"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-navy px-4 py-2 text-xs text-white print:hidden"
    >
      Print
    </button>
  );
}

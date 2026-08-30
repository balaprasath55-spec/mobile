import type { ReactNode } from "react";

export function compareAlphabetic(a: string, b: string): number {
  return a.localeCompare(b, "en", { sensitivity: "base", numeric: true });
}

/** Index of the first sequential (contiguous) match; lower is better. Prefix = 0, no match = Infinity. */
export function sequentialMatchIndex(text: string, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const idx = text.toLowerCase().indexOf(q);
  return idx === -1 ? Number.POSITIVE_INFINITY : idx;
}

export function bestSequentialRank(values: (string | null | undefined)[], query: string): number {
  let best = Number.POSITIVE_INFINITY;
  for (const value of values) {
    if (!value) continue;
    const rank = sequentialMatchIndex(value, query);
    if (rank < best) best = rank;
  }
  return best;
}

export function highlightSequentialMatch(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;

  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-amber-200/90 px-0.5 font-medium text-inherit dark:bg-amber-400/35">
        {text.slice(idx, idx + needle.length)}
      </mark>
      {text.slice(idx + needle.length)}
    </>
  );
}

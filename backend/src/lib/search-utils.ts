export function compareAlphabetic(a: string, b: string): number {
  return a.localeCompare(b, "en", { sensitivity: "base", numeric: true });
}

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

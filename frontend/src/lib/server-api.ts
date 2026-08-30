import { apiUrl } from "@/lib/api-client";

/** Server-side fetch to the Express backend (no Next.js API routes). */
export async function serverApi<T>(path: string, init?: RequestInit): Promise<T> {
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
}

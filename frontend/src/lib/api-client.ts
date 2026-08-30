const DEFAULT_API_URL = "http://localhost:4000";

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
}

export function apiUrl(path: string) {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p.startsWith("/api") ? p : `/api${p}`}`;
}

type ApiOptions = RequestInit & { json?: unknown };

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const { json, headers, ...rest } = options;
  const res = await fetch(apiUrl(path), {
    ...rest,
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  return res;
}

export type HttpClient = {
  get: <T>(url: string, init?: RequestInit) => Promise<{ data: T; status: number }>;
  post: <T>(url: string, body?: unknown, init?: RequestInit) => Promise<{ data: T; status: number }>;
  put: <T>(url: string, body?: unknown, init?: RequestInit) => Promise<{ data: T; status: number }>;
  delete: <T = unknown>(url: string, init?: RequestInit) => Promise<{ data: T; status: number }>;
};

const BASE_URL = (typeof window !== "undefined"
  ? (window as { APP_API_BASE_URL?: string }).APP_API_BASE_URL
  : process.env.PUBLIC_API_BASE_URL) || "/api";

async function request<T>(method: string, url: string, body?: unknown, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...init,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    const error = json ?? { code: "UNAVAILABLE", message: "Request failed" };
    throw Object.assign(new Error(error.message || "Request failed"), { status: res.status, data: json });
  }
  return { data: json as T, status: res.status };
}

export const httpClient: HttpClient = {
  get: <T>(url: string, init?: RequestInit) => request<T>("GET", url, undefined, init),
  post: <T>(url: string, body?: unknown, init?: RequestInit) => request<T>("POST", url, body, init),
  put: <T>(url: string, body?: unknown, init?: RequestInit) => request<T>("PUT", url, body, init),
  delete: <T>(url: string, init?: RequestInit) => request<T>("DELETE", url, undefined, init),
};
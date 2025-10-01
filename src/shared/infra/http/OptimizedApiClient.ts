import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
} from "axios";

const { VITE_API_BASE_URL } = import.meta.env;
const BASE_URL = VITE_API_BASE_URL || "http://localhost:8080";

/** Normaliza objetos para construir keys estables (útil para claves de React Query). */
function normalizeStable(input: unknown): unknown {
  if (input === null || input === undefined) return input;
  if (input instanceof Date) return input.toISOString();
  if (Array.isArray(input)) return input.map(normalizeStable);
  if (typeof input === "object") {
    const o = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o).sort()) out[k] = normalizeStable(o[k]);
    return out;
  }
  return input;
}

export function stableKey(input: unknown): string {
  try {
    return JSON.stringify(normalizeStable(input));
  } catch {
    return String(input);
  }
}

export function buildQueryKey(parts: ReadonlyArray<unknown>): ReadonlyArray<unknown> {
  return ["api", ...parts.map((p) => (typeof p === "object" ? stableKey(p) : p))];
}

export type RequestOptions = {
  params?: Record<string, unknown>;
  headers?: AxiosRequestHeaders;
  signal?: AbortSignal;
  withCredentials?: boolean;
};

export class OptimizedApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    });
    // 👇 OJO: sin attachLoadingInterceptors
  }

  get<T = unknown>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>("GET", url, undefined, options);
  }

  post<T = unknown>(url: string, body?: unknown, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>("POST", url, body, options);
  }

  put<T = unknown>(url: string, body?: unknown, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>("PUT", url, body, options);
  }

  delete<T = unknown>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>("DELETE", url, undefined, options);
  }

  clearCache() {
    // no-op (por compatibilidad)
  }

  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<AxiosResponse<T>> {
    const axiosConfig: AxiosRequestConfig<T> = { url, method };
    if (body !== undefined) axiosConfig.data = body as any;
    if (options?.params !== undefined) axiosConfig.params = options.params;
    if (options?.withCredentials !== undefined) axiosConfig.withCredentials = options.withCredentials;
    if (options?.headers !== undefined) axiosConfig.headers = options.headers as AxiosRequestHeaders;
    if (options?.signal !== undefined) axiosConfig.signal = options.signal;

    return this.axiosInstance.request<T>(axiosConfig);
  }
}

export const optimizedApiClient = new OptimizedApiClient(BASE_URL);

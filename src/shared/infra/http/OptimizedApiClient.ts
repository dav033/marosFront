/* eslint-disable @typescript-eslint/no-explicit-any */

// src/shared/infra/http/OptimizedApiClient.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
} from "axios";
// ⚠️ Eliminamos el uso de CachedRequestConfig (cache legacy).
// (Opcional) mantenga sus interceptores de loading si los usa:
import { attachLoadingInterceptors } from "./axiosLoadingInterceptors";

const { VITE_API_BASE_URL } = import.meta.env;
const BASE_URL = VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Normaliza objetos/arrays/fechas de forma determinística.
 * Útil para construir claves estables de consultas (Query Keys).
 */
function normalizeStable(input: unknown): unknown {
  if (input === null || input === undefined) return input;
  if (input instanceof Date) return input.toISOString();
  if (Array.isArray(input)) return input.map(normalizeStable);
  if (typeof input === "object") {
    const o = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o).sort()) {
      out[k] = normalizeStable(o[k]);
    }
    return out;
  }
  return input;
}

/** Serializa de forma estable (si desea usar string como parte del queryKey) */
export function stableKey(input: unknown): string {
  try {
    return JSON.stringify(normalizeStable(input));
  } catch {
    return String(input);
  }
}

/**
 * Construye un queryKey estable para TanStack Query:
 * - Convierte los objetos en su representación estable (string) para evitar
 *   claves distintas por orden de propiedades.
 * - Puede usarlo así: queryKey: buildQueryKey(['leads', leadType, { params }])
 */
export function buildQueryKey(parts: ReadonlyArray<unknown>): ReadonlyArray<unknown> {
  return ["api", ...parts.map((p) => (typeof p === "object" ? stableKey(p) : p))];
}

/** Configuración de petición sin campos de caché legacy */
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
    attachLoadingInterceptors?.(this.axiosInstance);
  }

  // ========= API pública (sin caché propia; TanStack Query la gestiona) =========
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

  /** Método sin efecto, por compatibilidad con llamadas antiguas */
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  clearCache() {
    // No-op: la invalidación ahora se maneja con React Query (queryClient.invalidateQueries)
  }

  // ========= Internos =========
  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<AxiosResponse<T>> {
    // Con exactOptionalPropertyTypes, sólo pasamos props definidas
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

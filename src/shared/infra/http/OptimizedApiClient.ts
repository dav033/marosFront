/* eslint-disable @typescript-eslint/no-explicit-any */

// src/shared/infra/http/OptimizedApiClient.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
} from "axios";
import { unifiedCache } from "./cache/cacheManager";
import type { CachedRequestConfig } from "./types";
// (Opcional) mantenga sus interceptores de loading si los usa:
import { attachLoadingInterceptors } from "./axiosLoadingInterceptors";

const { VITE_API_BASE_URL } = import.meta.env;
const BASE_URL = VITE_API_BASE_URL || "http://localhost:8080";

/**
 * stableKey: serializa objetos/arrays/fechas de forma determinística
 * para construir claves de caché estables e independientes del orden
 * de las propiedades.
 */
function stableKey(input: unknown): string {
  const normalize = (v: unknown): unknown => {
    if (v === null || v === undefined) return v;
    if (v instanceof Date) return v.toISOString();
    if (Array.isArray(v)) return v.map(normalize);
    if (typeof v === "object") {
      const o = v as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) {
        out[k] = normalize(o[k]);
      }
      return out;
    }
    return v;
  };
  try {
    return JSON.stringify(normalize(input));
  } catch {
    return String(input);
  }
}

export class OptimizedApiClient {
  private axiosInstance: AxiosInstance;
  private inFlight = new Map<string, Promise<AxiosResponse<any>>>();

  constructor(baseURL: string = BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    });
    attachLoadingInterceptors?.(this.axiosInstance);
  }

  // ========= API pública =========
  get<T = unknown>(url: string, config?: CachedRequestConfig) {
    return this.cachedRequest<T>("GET", url, undefined, config);
  }
  post<T = unknown>(url: string, body?: unknown, config?: CachedRequestConfig) {
    return this.makeRequest<T>("POST", url, body, config);
  }
  put<T = unknown>(url: string, body?: unknown, config?: CachedRequestConfig) {
    return this.makeRequest<T>("PUT", url, body, config);
  }
  delete<T = unknown>(url: string, config?: CachedRequestConfig) {
    return this.makeRequest<T>("DELETE", url, undefined, config);
  }

  clearCache() { unifiedCache.clear(); }

  // ========= Internos =========
  private generateCacheKey(method: string, url: string, params?: Record<string, unknown>) {
    const q = params ? stableKey(params) : "";
    return `${method}:${url}?${q}`;
  }

  private async cachedRequest<T>(
    method: "GET",
    url: string,
    _body?: unknown,
    config?: CachedRequestConfig
  ): Promise<AxiosResponse<T>> {
    const cacheCfg = { enabled: true, strategy: "cache-first" as const, ttl: 5 * 60_000, ...(config?.cache ?? {}) };
    const key = this.generateCacheKey(method, url, config?.params);

    // 1) Intento "fresh"
    if (cacheCfg.enabled && cacheCfg.strategy !== "network-only") {
      const hit = unifiedCache.getFresh<AxiosResponse<T>>(key);
      if (hit) return hit.value;
    }

    // 2) SWR: devolver STALE y revalidar en background
    if (cacheCfg.enabled && cacheCfg.strategy === "cache-first") {
      const stale = unifiedCache.peekAny<AxiosResponse<T>>(key);
      if (stale && !stale.fresh) {
        void this.refreshWithDedupe<T>(key, method, url, undefined, config, cacheCfg.ttl);
        return stale.value;
      }
    }

    // 3) Red con deduplicación
    return this.refreshWithDedupe<T>(key, method, url, undefined, config, cacheCfg.ttl);
  }

  private refreshWithDedupe<T>(
    cacheKey: string,
    method: "GET",
    url: string,
    body: unknown,
    config?: CachedRequestConfig,
    ttl?: number
  ): Promise<AxiosResponse<T>> {
    const existing = this.inFlight.get(cacheKey);
    if (existing) return existing as Promise<AxiosResponse<T>>;

    const p = this.makeRequest<T>(method, url, body, config)
      .then((res) => {
        if (ttl != null) unifiedCache.set(cacheKey, res, ttl);
        return res;
      })
      .finally(() => this.inFlight.delete(cacheKey));

    this.inFlight.set(cacheKey, p);
    return p;
  }

  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
    config?: CachedRequestConfig
  ): Promise<AxiosResponse<T>> {
    const axiosConfig: AxiosRequestConfig<T> = {
      url, method, data: body as any,
      params: config?.params,
      withCredentials: config?.withCredentials ?? false,
    };
    if (config?.headers) axiosConfig.headers = config.headers as AxiosRequestHeaders;
    if (config?.signal) axiosConfig.signal = config.signal;

    return this.axiosInstance.request<T>(axiosConfig);
  }
}

export const optimizedApiClient = new OptimizedApiClient(BASE_URL);

// src/shared/infra/http/OptimizedApiClient.ts
/**
 * API Client optimizado con sistema de cache y prefetch integrado.
 * - BaseURL directo a 8080 (tomado de .env o fallback).
 * - Credenciales desactivadas por defecto para evitar conflictos CORS con ACAO:"*".
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { getErrorMessage } from "@/utils/errors";
import { attachLoadingInterceptors } from "./axiosLoadingInterceptors";
import { apiCache, globalCache } from "./cache/cacheManager";
import type { CachedRequestConfig, RequestMetrics } from "./types";
import { prefetchManager } from "./prefetch/prefetchManager";

// ========= ENV y defaults =========
const { VITE_API_BASE_URL, VITE_ENABLE_DIAGNOSTICS, VITE_ENABLE_CACHE } =
  import.meta.env;

// Forzar 8080 como destino directo si no hay ENV
const BASE_URL = VITE_API_BASE_URL || "http://localhost:8080";

const DIAG =
  VITE_ENABLE_DIAGNOSTICS === true ||
  VITE_ENABLE_DIAGNOSTICS === "true" ||
  VITE_ENABLE_DIAGNOSTICS === "1";

const CACHE_ENABLED_DEFAULT =
  VITE_ENABLE_CACHE === true ||
  VITE_ENABLE_CACHE === "true" ||
  VITE_ENABLE_CACHE === "1";
// ==================================

export class OptimizedApiClient {
  private axiosInstance: AxiosInstance;

  private metrics: RequestMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    failedRequests: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    prefetchSuccess: 0,
    prefetchFailed: 0,
  };

  private responseTimes: number[] = [];

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL, // ⬅️ http://localhost:8080 (o el valor de VITE_API_BASE_URL)
      headers: { "Content-Type": "application/json" },
      withCredentials: false, // ⬅️ MUY IMPORTANTE para CORS cuando el backend usa ACAO:"*"
    });

    this.setupInterceptors();
    attachLoadingInterceptors(this.axiosInstance);

    // Inyectar requester para prefetch sin dependencia circular
    prefetchManager.setRequester(async (depUrl: string) => {
      try {
        await this.axiosInstance.get(depUrl, { withCredentials: false });
      } catch {
        /* noop */
      }
    });
  }

  async get<T = unknown>(
    url: string,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    const cacheKey = this.generateCacheKey("GET", url, config.params);
    const cacheConfig = {
      enabled: CACHE_ENABLED_DEFAULT,
      strategy: "cache-first" as const,
      ...(config.cache ?? {}),
    };

    if (cacheConfig.enabled && cacheConfig.strategy !== "network-only") {
      const cached = this.getCachedResponse<T>(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        this.recordResponseTime(Date.now() - startTime);
        if (cacheConfig.strategy === "cache-first") return cached;
      } else {
        this.metrics.cacheMisses++;
      }
    }

    if (cacheConfig.strategy === "cache-only") {
      throw new Error(`No cached data available for ${url}`);
    }

    try {
      this.metrics.networkRequests++;
      const response = await this.makeRequest<T>("GET", url, undefined, config);

      if (cacheConfig.enabled) {
        this.setCachedResponse(cacheKey, response, cacheConfig.ttl);
      }

      const deps = config.prefetch?.dependencies || [];
      if (deps.length > 0) {
        await prefetchManager.prefetchMany(deps);
        this.metrics.prefetchSuccess += deps.length;
      }

      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;

      if (DIAG) {
        if (axios.isAxiosError(error)) {
          // eslint-disable-next-line no-console
          console.warn(
            `API Error: ${error.response?.status} ${error.response?.statusText}`
          );
        } else {
          // eslint-disable-next-line no-console
          console.warn("API Error:", getErrorMessage(error));
        }
      }

      if (cacheConfig.enabled && cacheConfig.strategy === "network-first") {
        const cached = this.getCachedResponse<T>(cacheKey);
        if (cached) return cached;
      }
      throw error;
    }
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>("POST", url, body, config);
  }

  async put<T = unknown>(
    url: string,
    body?: unknown,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>("PUT", url, body, config);
  }

  async delete<T = unknown>(
    url: string,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest<T>("DELETE", url, undefined, config);
  }

  // ———————————————————— Privates ————————————————————

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        (config as { startTime?: number }).startTime = Date.now();
        (config as unknown as { __diag?: boolean }).__diag = DIAG;

        // Asegurar que no se reintroduzcan credenciales salvo que se pidan explícitamente
        if (typeof config.withCredentials !== "boolean") {
          config.withCredentials = false;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const start = (response.config as { startTime?: number }).startTime;
        if (typeof start === "number") {
          this.recordResponseTime(Date.now() - start);
        }
        return response;
      },
      (error) => {
        const enable = (error?.config as any)?.__diag;
        if (enable && axios.isAxiosError(error)) {
          // eslint-disable-next-line no-console
          console.warn(
            `API Error: ${error.response?.status} ${error.response?.statusText}`,
            {
              url: error.config?.url,
              method: error.config?.method,
              data: error.response?.data,
            }
          );
        }
        return Promise.reject(error);
      }
    );
  }

  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
    config?: CachedRequestConfig
  ): Promise<AxiosResponse<T>> {
    // exactOptionalPropertyTypes: true
    const axiosConfig: AxiosRequestConfig<T> = {
      url,
      method,
      data: body as any,
      params: config?.params,
      // ⬇️ credenciales desactivadas por defecto (clave para CORS al ir directo a 8080)
      withCredentials: config?.withCredentials ?? false,
    };

    if (config?.headers) {
      axiosConfig.headers = config.headers as AxiosRequestHeaders;
    }
    if (config?.signal) {
      axiosConfig.signal = config.signal;
    }

    return this.axiosInstance.request<T>(axiosConfig);
  }

  private getCachedResponse<T>(key: string): AxiosResponse<T> | null {
    const res =
      (apiCache.get(key) as AxiosResponse<T> | undefined | null) ??
      (globalCache.get(key) as AxiosResponse<T> | undefined | null);
    return res ?? null;
  }

  private setCachedResponse<T>(
    key: string,
    response: AxiosResponse<T>,
    ttl?: number
  ): void {
    apiCache.set(key, response, ttl);
  }

  private recordResponseTime(ms: number): void {
    this.responseTimes.push(ms);
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime =
      this.responseTimes.length > 0 ? sum / this.responseTimes.length : 0;
  }

  private generateCacheKey(
    method: string,
    url: string,
    params?: Record<string, unknown>
  ): string {
    const q = params ? JSON.stringify(params) : "";
    return `${method}:${url}?${q}`;
  }
}

// ⬅️ BaseURL directo a 8080 (o el valor exacto de su .env)
export const optimizedApiClient = new OptimizedApiClient(BASE_URL);

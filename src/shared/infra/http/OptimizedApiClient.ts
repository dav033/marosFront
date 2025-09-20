// src/shared/infra/http/OptimizedApiClient.ts
/**
 * API Client optimizado con sistema de cache y prefetch integrado
 */
import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { apiCache, globalCache } from "./cache/cacheManager";
import { prefetchManager } from "./prefetch/prefetchManager";
import type {
  CachedRequestConfig,
  RequestMetrics,
  OptimizedApiClientMetrics,
} from "./types";

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
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    this.setupInterceptors();
  }

  async get<T = unknown>(
    url: string,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    const cacheKey = this.generateCacheKey("GET", url, config.params);
    const cacheConfig = {
      enabled: true,
      strategy: "cache-first" as const,
      ...config.cache,
    };

    if (cacheConfig.enabled && cacheConfig.strategy !== "network-only") {
      const cached = this.getCachedResponse<T>(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        this.recordResponseTime(Date.now() - startTime);
        if (cacheConfig.strategy === "cache-first") {
          return cached;
        }
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

      this.processPrefetchDependencies(config.prefetch?.dependencies || []);

      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;
      if (cacheConfig.enabled && cacheConfig.strategy === "network-first") {
        const cached = this.getCachedResponse<T>(cacheKey);
        if (cached) {
          console.warn(
            `Network failed for ${url}, returning cached data:`,
            error
          );
          return cached;
        }
      }
      throw error;
    }
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    this.metrics.networkRequests++;

    try {
      const response = await this.makeRequest<T>("POST", url, data, config);
      this.invalidateRelatedCache(url, "POST");
      this.processPrefetchDependencies(config.prefetch?.dependencies || []);
      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    this.metrics.networkRequests++;

    try {
      const response = await this.makeRequest<T>("PUT", url, data, config);
      this.invalidateRelatedCache(url, "PUT");
      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  async delete<T = unknown>(
    url: string,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    this.metrics.networkRequests++;

    try {
      const response = await this.makeRequest<T>(
        "DELETE",
        url,
        undefined,
        config
      );
      this.invalidateRelatedCache(url, "DELETE");
      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  async prefetch(url: string, config: CachedRequestConfig = {}): Promise<void> {
    const cacheKey = this.generateCacheKey("GET", url, config.params);
    if (this.getCachedResponse(cacheKey)) {
      this.metrics.prefetchSuccess++;
      return;
    }

    try {
      prefetchManager.register(
        cacheKey,
        () =>
          this.get(url, { ...config, cache: { enabled: true } }).then(
            (r) => r.data
          ),
        {
          priority: config.prefetch?.priority || "medium",
          enabled: config.prefetch?.enabled !== false,
        }
      );
      await prefetchManager.execute(cacheKey);
      this.metrics.prefetchSuccess++;
    } catch (error) {
      this.metrics.prefetchFailed++;
      console.warn(`Prefetch failed for ${url}:`, error);
    }
  }

  setupPrefetch(url: string, config: CachedRequestConfig = {}): string {
    const cacheKey = this.generateCacheKey("GET", url, config.params);
    return prefetchManager.register(
      cacheKey,
      () =>
        this.get(url, { ...config, cache: { enabled: true } }).then(
          (r) => r.data
        ),
      {
        priority: config.prefetch?.priority || "medium",
        enabled: config.prefetch?.enabled !== false,
      }
    );
  }

  getMetrics(): OptimizedApiClientMetrics {
    const gStats = globalCache.getStats(); // { size, hits, misses }
    const aStats = apiCache.getStats(); // { size, hits, misses }
    const pStats = prefetchManager.getStats(); // { total, queued, running, completed, failed }

    return {
      client: {
        // métricas internas del cliente
        ...this.metrics,
        // alias agregados que pide el tipo
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        evictions: 0,
        size: this.metrics.totalRequests,
      },
      globalCache: {
        // stats base
        ...gStats, // size, hits, misses
        // agregados sin colisión
        totalRequests: gStats.size ?? 0,
        totalHits: gStats.hits ?? 0,
        totalMisses: gStats.misses ?? 0,
        totalEvictions: 0,
      },
      apiCache: {
        // NO duplicamos hits/misses: vienen del spread
        ...aStats, // size, hits, misses
        requests: aStats.size ?? 0,
        errors: 0,
      },
      prefetch: {
        // stats base
        ...pStats, // total, queued, running, completed, failed
        // agregados sin colisión
        prefetches: pStats.total ?? 0,
        successful: pStats.completed ?? 0,
      },
    };
  }

  resetMetrics(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      failedRequests: 0,
      totalRequests: 0,
      averageResponseTime: 0,
      prefetchSuccess: 0,
      prefetchFailed: 0,
    };
    this.responseTimes = [];
  }

  clearCache(): void {
    apiCache.clear();
    globalCache.clear();
  }

  private async makeRequest<T>(
    method: string,
    url: string,
    data?: unknown,
    config: CachedRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    const retryConfig = {
      enabled: true,
      attempts: 3,
      delay: 1000,
      backoff: "exponential" as const,
      ...config.retry,
    };

    let lastError: unknown;

    for (
      let attempt = 0;
      attempt < (retryConfig.enabled ? retryConfig.attempts : 1);
      attempt++
    ) {
      try {
        const response = await this.axiosInstance.request<T>({
          method,
          url,
          data,
          ...config,
        });
        return response;
      } catch (error) {
        lastError = error;

        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response.status < 500
        ) {
          break;
        }

        if (attempt < retryConfig.attempts - 1) {
          const delay =
            retryConfig.backoff === "exponential"
              ? retryConfig.delay * Math.pow(2, attempt)
              : retryConfig.delay;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  private generateCacheKey(
    method: string,
    url: string,
    params?: Record<string, unknown>
  ): string {
    const baseKey = `api_${method}_${url}`;
    if (params) {
      const sortedParams = Object.keys(params)
        .sort()
        .reduce(
          (obj, key) => {
            obj[key] = params[key];
            return obj;
          },
          {} as Record<string, unknown>
        );
      return `${baseKey}_${JSON.stringify(sortedParams)}`;
    }
    return baseKey;
  }

  private getCachedResponse<T>(key: string): AxiosResponse<T> | null {
    const cached = apiCache.get(key);
    if (cached) {
      return {
        data: cached as T,
        status: 200,
        statusText: "OK (Cached)",
        headers: {},
        config: {
          headers: {},
        } as import("axios").InternalAxiosRequestConfig<unknown>,
        request: {},
      };
    }
    return null;
  }

  private setCachedResponse<T>(
    key: string,
    response: AxiosResponse<T>,
    ttl?: number
  ): void {
    apiCache.set(key, response.data, ttl);
  }

  private invalidateRelatedCache(url: string, method: string): void {
    const patterns: Record<string, RegExp[]> = {
      "/leads": [/api_GET_\/leads/, /api_GET_\/dashboard/],
      "/contacts": [/api_GET_\/contacts/, /api_GET_\/dashboard/],
      "/projects": [/api_GET_\/projects/, /api_GET_\/dashboard/],
    };

    const baseUrl = url.split("?")[0];

    for (const [pattern, regexes] of Object.entries(patterns)) {
      if (baseUrl.includes(pattern)) {
        regexes.forEach((regex) => {
          const invalidated = apiCache.invalidatePattern(regex);
          if (invalidated > 0) {
            console.debug(
              `Invalidated ${invalidated} cache entries for pattern ${regex}`
            );
          }
        });
      }
    }
  }

  private processPrefetchDependencies(dependencies: string[]): void {
    dependencies.forEach((dep) => {
      this.setupPrefetch(dep);
    });
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        (config as { startTime?: number }).startTime = Date.now();
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        let startTime: number | undefined = undefined;
        if (
          typeof (response.config as { startTime?: unknown }).startTime ===
          "number"
        ) {
          startTime = (response.config as { startTime?: number }).startTime;
        }
        if (startTime) {
          const responseTime = Date.now() - startTime;
          this.recordResponseTime(responseTime);
        }
        return response;
      },
      (error) => {
        if (axios.isAxiosError(error)) {
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

  private recordResponseTime(time: number): void {
    this.responseTimes.push(time);
    if (this.responseTimes.length > 100) this.responseTimes.shift();
    const avg = this.calculateAverageResponseTime();
    this.metrics.averageResponseTime = avg;
  }

  private calculateAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    const sum = this.responseTimes.reduce((acc, t) => acc + t, 0);
    return Math.round(sum / this.responseTimes.length);
  }
}

// Crear instancia optimizada usando una única .env
type EnvLike = { [key: string]: string | boolean | number | undefined };
const envFromImportMeta =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: EnvLike }).env) ||
  undefined;
const envFromProcess =
  (typeof process !== "undefined" &&
    (process as unknown as { env?: EnvLike }).env) ||
  undefined;

const explicitUrl =
  (envFromImportMeta?.PUBLIC_API_BASE_URL as string | undefined) ||
  (envFromImportMeta?.VITE_API_BASE_URL as string | undefined) ||
  (envFromProcess?.PUBLIC_API_BASE_URL as string | undefined) ||
  (envFromProcess?.VITE_API_BASE_URL as string | undefined);

const appEnv =
  (envFromImportMeta?.PUBLIC_APP_ENV as string | undefined) ||
  (envFromImportMeta?.MODE as string | undefined) ||
  (envFromProcess?.PUBLIC_APP_ENV as string | undefined) ||
  (envFromProcess?.NODE_ENV as string | undefined) ||
  "development";

const baseDev =
  (envFromImportMeta?.PUBLIC_API_BASE_URL_DEV as string | undefined) ||
  (envFromProcess?.PUBLIC_API_BASE_URL_DEV as string | undefined);
const baseProd =
  (envFromImportMeta?.PUBLIC_API_BASE_URL_PROD as string | undefined) ||
  (envFromProcess?.PUBLIC_API_BASE_URL_PROD as string | undefined);

const derivedUrl = /prod/i.test(appEnv)
  ? baseProd || baseDev
  : baseDev || baseProd;
const API_BASE_URL = explicitUrl || derivedUrl || "http://localhost:8080";

export const optimizedApiClient = new OptimizedApiClient(API_BASE_URL);

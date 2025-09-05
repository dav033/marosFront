/**
 * API Client optimizado con sistema de cache y prefetch integrado
 */

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiCache, globalCache } from "./cacheManager";
import { prefetchManager } from "./prefetchManager";
import type { CacheMetrics } from "../types/cache";

export interface CachedRequestConfig extends AxiosRequestConfig {
  cache?: {
    enabled?: boolean;
    ttl?: number; // Time to live en milliseconds
    key?: string; // Clave personalizada para el cache
    strategy?: "cache-first" | "network-first" | "cache-only" | "network-only";
  };
  prefetch?: {
    enabled?: boolean;
    priority?: "low" | "medium" | "high";
    dependencies?: string[]; // Otras requests que deberían prefetched junto con esta
  };
  retry?: {
    enabled?: boolean;
    attempts?: number;
    delay?: number;
    backoff?: "linear" | "exponential";
  };
}

export interface RequestMetrics {
  cacheHits: number;
  cacheMisses: number;
  networkRequests: number;
  failedRequests: number;
  totalRequests: number;
  averageResponseTime: number;
  prefetchSuccess: number;
  prefetchFailed: number;
}

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

  /**
   * GET request con cache y prefetch
   */
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

    // Verificar cache primero si está habilitado
    if (cacheConfig.enabled && cacheConfig.strategy !== "network-only") {
      const cached = this.getCachedResponse<T>(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        this.recordResponseTime(Date.now() - startTime);

        // Si es cache-first, devolver inmediatamente
        if (cacheConfig.strategy === "cache-first") {
          return cached;
        }
      } else {
        this.metrics.cacheMisses++;
      }
    }

    // Si es cache-only y no hay cache, lanzar error
    if (cacheConfig.strategy === "cache-only") {
      throw new Error(`No cached data available for ${url}`);
    }

    try {
      // Hacer la request de red
      this.metrics.networkRequests++;
      const response = await this.makeRequest<T>("GET", url, undefined, config);

      // Guardar en cache si está habilitado
      if (cacheConfig.enabled) {
        this.setCachedResponse(cacheKey, response, cacheConfig.ttl);
      }

      // Procesar prefetch dependencies
      this.processPrefetchDependencies(config.prefetch?.dependencies || []);

      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;

      // Si falló la red pero hay cache, devolver cache como fallback
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

  /**
   * POST request con cache inteligente
   */
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

      // Invalidar cache relacionado después de POST
      this.invalidateRelatedCache(url, "POST");

      // Procesar prefetch dependencies
      this.processPrefetchDependencies(config.prefetch?.dependencies || []);

      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  /**
   * PUT request con cache inteligente
   */
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

      // Invalidar cache relacionado después de PUT
      this.invalidateRelatedCache(url, "PUT");

      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  /**
   * DELETE request con cache inteligente
   */
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

      // Invalidar cache relacionado después de DELETE
      this.invalidateRelatedCache(url, "DELETE");

      this.recordResponseTime(Date.now() - startTime);
      return response;
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }

  /**
   * Prefetch manual de una URL
   */
  async prefetch(url: string, config: CachedRequestConfig = {}): Promise<void> {
    const cacheKey = this.generateCacheKey("GET", url, config.params);

    // Verificar si ya está en cache
    if (this.getCachedResponse(cacheKey)) {
      this.metrics.prefetchSuccess++;
      return;
    }

    try {
      // Registrar tarea de prefetch si no existe
      const prefetchId = prefetchManager.register(
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

      // Ejecutar prefetch
      await prefetchManager.execute(cacheKey);
      this.metrics.prefetchSuccess++;
    } catch (error) {
      this.metrics.prefetchFailed++;
      console.warn(`Prefetch failed for ${url}:`, error);
    }
  }

  /**
   * Configurar prefetch automático para una URL
   */
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

  /**
   * Obtener métricas del cliente
   */
  getMetrics(): CacheMetrics {
    return {
      client: {
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        evictions: 0, // Si tienes este dato, reemplaza aquí
        size: this.metrics.totalRequests,
        ...this.metrics,
      },
      globalCache: {
        totalRequests: globalCache.getStats().size ?? 0,
        totalHits: globalCache.getStats().hits ?? 0,
        totalMisses: globalCache.getStats().misses ?? 0,
        totalEvictions: 0,
        ...globalCache.getStats(),
      },
      apiCache: {
        requests: apiCache.getStats().size ?? 0,
        hits: apiCache.getStats().hits ?? 0,
        misses: apiCache.getStats().misses ?? 0,
        errors: 0,
        ...apiCache.getStats(),
      },
      prefetch: {
        prefetches: prefetchManager.getStats().total ?? 0,
        successful: prefetchManager.getStats().completed ?? 0,
        ...prefetchManager.getStats(),
      },
    };
  }

  /**
   * Limpiar todas las métricas
   */
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

  /**
   * Limpiar todos los caches
   */
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

        // No reintentar en ciertos casos
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response.status < 500
        ) {
          break;
        }

        // Si no es el último intento, esperar antes de reintentar
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
        config: { headers: {} } as import("axios").InternalAxiosRequestConfig<unknown>,
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
    // Estrategias de invalidación basadas en el endpoint
    const patterns: Record<string, RegExp[]> = {
      "/leads": [/api_GET_\/leads/, /api_GET_\/dashboard/],
      "/contacts": [/api_GET_\/contacts/, /api_GET_\/dashboard/],
      "/projects": [/api_GET_\/projects/, /api_GET_\/dashboard/],
    };

    const baseUrl = url.split("?")[0]; // Remover query params

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
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Añadir timestamp para métricas
        (config as { startTime?: number }).startTime = Date.now();
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Calcular tiempo de respuesta
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
        // Log de errores para debugging
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
    // Mantener solo las últimas 100 mediciones
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  private calculateAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    const sum = this.responseTimes.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / this.responseTimes.length);
  }
}

// Crear instancia optimizada usando una única .env
// Variables soportadas:
// - PUBLIC_API_BASE_URL (override directo)
// - VITE_API_BASE_URL (compatibilidad)
// - PUBLIC_APP_ENV = development | production (selección de entorno)
// - PUBLIC_API_BASE_URL_DEV, PUBLIC_API_BASE_URL_PROD (urls por entorno)
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

// Re-exportar el cliente original para compatibilidad

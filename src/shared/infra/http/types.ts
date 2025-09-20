import type { AxiosResponse } from "axios";

// src/shared/infra/http/types.ts
export type CacheStrategy =
  | "cache-first"
  | "network-first"
  | "cache-only"
  | "network-only";

export type CachedRequestConfig = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  cache?: {
    enabled?: boolean;
    strategy?: CacheStrategy; // default: cache-first
    ttl?: number; // ms
  };
  retry?: {
    enabled?: boolean;
    attempts?: number;
    delay?: number; // ms
    backoff?: "exponential" | "linear";
  };
  prefetch?: {
    enabled?: boolean;
    priority?: "low" | "medium" | "high";
    dependencies?: string[];
  };
};

export type RequestMetrics = {
  cacheHits: number;
  cacheMisses: number;
  networkRequests: number;
  failedRequests: number;
  totalRequests: number;
  averageResponseTime: number;
  prefetchSuccess: number;
  prefetchFailed: number;
};

export type SimpleCacheStats = {
  size: number;
  hits: number;
  misses: number;
};

export type PrefetchStats = {
  total: number;
  queued: number;
  running: number;
  completed: number;
  failed: number;
};

export type OptimizedApiClientMetrics = {
  client: RequestMetrics & {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
  };
  globalCache: SimpleCacheStats & {
    totalRequests: number;
    totalHits: number;
    totalMisses: number;
    totalEvictions: number;
  };
  apiCache: SimpleCacheStats & {
    requests: number;
    hits: number;
    misses: number;
    errors: number;
  };
  prefetch: PrefetchStats & { prefetches: number; successful: number };
};

export type HttpClientLike = {
  get<T = unknown>(
    url: string,
    config?: CachedRequestConfig
  ): Promise<AxiosResponse<T>>;

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: CachedRequestConfig
  ): Promise<AxiosResponse<T>>;

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: CachedRequestConfig
  ): Promise<AxiosResponse<T>>;

  delete<T = unknown>(
    url: string,
    config?: CachedRequestConfig
  ): Promise<AxiosResponse<T>>;
};

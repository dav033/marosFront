import type { AxiosRequestHeaders } from "axios";

export type CacheStrategy =
  | "cache-first"
  | "network-first"
  | "cache-only"
  | "network-only";

export interface CachedRequestConfig {
    params?: Record<string, unknown>;

    headers?: AxiosRequestHeaders | Record<string, string>;

    withCredentials?: boolean;

    signal?: AbortSignal;

    cache?: {
    enabled?: boolean;
    strategy?: CacheStrategy;
    ttl?: number; // milisegundos
  };

    prefetch?: {
    dependencies?: string[];
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

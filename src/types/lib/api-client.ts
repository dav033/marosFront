// src/types/lib/api-client.ts

import type { AxiosRequestConfig } from "axios";

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

export interface OptimizedApiClientMetrics {
  client: RequestMetrics & {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
  };
  globalCache: {
    totalRequests: number;
    totalHits: number;
    totalMisses: number;
    totalEvictions: number;
    size: number;
    maxSize: number;
    valid: number;
    expired: number;
    [key: string]: unknown;
  };
  apiCache: {
    requests: number;
    hits: number;
    misses: number;
    errors: number;
    size: number;
    maxSize: number;
    valid: number;
    expired: number;
    [key: string]: unknown;
  };
  prefetch: {
    prefetches: number;
    successful: number;
    total: number;
    pending: number;
    runningTasks: number;
    completed: number;
    failed: number;
    queueSize: number;
    [key: string]: unknown;
  };
}

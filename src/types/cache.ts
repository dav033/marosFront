// src/types/cache.ts

export interface ClientCacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  [key: string]: number;
}

export interface GlobalCacheMetrics {
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  totalEvictions: number;
  [key: string]: number;
}

export interface ApiCacheMetrics {
  requests: number;
  hits: number;
  misses: number;
  errors: number;
  [key: string]: number;
}

export interface PrefetchMetrics {
  prefetches: number;
  successful: number;
  failed: number;
  [key: string]: number;
}

export interface CacheMetrics {
  client: ClientCacheMetrics;
  globalCache: GlobalCacheMetrics;
  apiCache: ApiCacheMetrics;
  prefetch: PrefetchMetrics;
}

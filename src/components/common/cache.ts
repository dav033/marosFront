export interface CacheGauge {
  size: number;
  expired: number;
  hits?: number;
  misses?: number;
  valid?: number;
  maxSize?: number;
  oldestEntry?: number | null;
  newestEntry?: number | null;
  [k: string]: number | null | undefined;
}
export interface PrefetchStats {
  total?: number;
  prefetches?: number;
  completed?: number;
  successful?: number;
  failed?: number;
  [k: string]: number | undefined;
}
export interface CacheMetrics {
  globalCache: CacheGauge;
  apiCache: CacheGauge;
  prefetch: PrefetchStats;
  client?: {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
  };
}

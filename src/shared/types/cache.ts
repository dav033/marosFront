export type CacheEntry<T = unknown> = {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
};

export type CacheConfig = {
  defaultTtl: number;
  maxSize: number;
  cleanupInterval: number;
};

export type CacheStats = {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
};
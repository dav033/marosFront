// src/types/utils/cache.ts

export interface CachedResult<T> {
  data: T | null;
  age: number;
}

export interface CacheEntry<T> {
  value: T;
  expiry: number;
  lastAccessed: number;
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  storage: "memory" | "localStorage" | "sessionStorage";
}

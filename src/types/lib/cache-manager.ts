export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  storage: "memory" | "sessionStorage" | "localStorage";
}

export interface CacheMock {
  get: () => null;
  set: () => void;
  delete: () => void;
  clear: () => void;
  has: () => false;
  getStats: () => { size: 0; hits: 0; misses: 0; expired: 0 };
  cleanup: () => void;
  destroy: () => void;
}

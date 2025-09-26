export type StorageLayer = "memory" | "localStorage" | "sessionStorage" | "indexedDB";

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  size?: number;
  hits: number;
  lastAccessed: number;
}

export interface CacheMetrics {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  evictions: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  topKeys: Array<{
    key: string;
    hits: number;
    size: number;
    lastAccessed: number;
  }>;
  performanceStats: {
    averageGetTime: number;
    averageSetTime: number;
    averageDeleteTime: number;
  };
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  maxEntries: number;
  enableMetrics: boolean;
  enablePersistence: boolean;
  persistenceKey: string;
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface CacheDebugConfig {
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enablePerformanceTracking: boolean;
  enableMemoryTracking: boolean;
  maxLogEntries: number;
}

export interface CacheStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
  size(): Promise<number>;
}

export interface CacheManager {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  invalidatePattern(pattern: string): Promise<number>;
  updateConfig(config: Partial<CacheConfig>): void;
  enableDebug(config: CacheDebugConfig): void;
  export(): Promise<Record<string, unknown>>;
  import(data: Record<string, unknown>): Promise<void>;
}

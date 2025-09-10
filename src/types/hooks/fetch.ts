// src/types/hooks/fetch.ts

import type { AxiosRequestConfig } from "axios";

// ===========================================
// FETCH HOOK TYPES
// ===========================================

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

export interface FetchOptions extends AxiosRequestConfig {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
  cacheKey?: string;
  cacheTtl?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
  reset: () => void;
}

// Optimized fetch types
export interface OptimizedFetchConfig {
  enableCache?: boolean;
  enableRetry?: boolean;
  enableBackground?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  cacheTTL?: number;
  backgroundRefresh?: boolean;
}

export interface FetchContextValue {
  defaultConfig: OptimizedFetchConfig;
  setDefaultConfig: (config: Partial<OptimizedFetchConfig>) => void;
  metrics: Map<string, import("../lib/api-client").RequestMetrics>;
  clearMetrics: () => void;
}

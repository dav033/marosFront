import type { StorageLayer } from "../system/cache";

export interface OptimizedFetchConfig {
  cacheKey: string;
  ttl?: number;
  storage?: StorageLayer;
  showSkeletonOnlyOnFirstLoad?: boolean;
  refetchInterval?: number;
  backgroundRefreshThreshold?: number;
}

export interface UseOptimizedFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fromCache: boolean;
  cacheAge: number;
  forceRefresh: () => Promise<void>;
}

export interface VisibilityIntervalOptions {
  interval?: number;
  enabled?: boolean;
  immediate?: boolean;
}

export type Undetermined = "UNDETERMINED";

export interface LeadsByTypeConfig {
  bucketKey: string;
  leadType: string;
}

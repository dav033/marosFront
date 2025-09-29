import { useMemo } from "react";
import type { OptimizedFetchConfig, UseOptimizedFetchReturn } from "@/types";
import { cacheConfig } from "@/lib/cacheConfig";
import { type Fetcher, useCacheQuery } from "@/lib/cache";

export function useOptimizedFetch<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  params: P,
  config: OptimizedFetchConfig
): UseOptimizedFetchReturn<T> {
  const {
    cacheKey,
    ttl = 300_000,
    refetchInterval,
    showSkeletonOnlyOnFirstLoad = true,
  } = config;

  
  const cfg = cacheConfig.get();
  const cachingEnabled = cfg.enabled !== false;

  const fetcher: Fetcher<T> = async () => requestFn(...params);

  const { data, isLoading, isFetching, isStale, error, updatedAt, refetch } =
    useCacheQuery<T>(["ofetch", cacheKey], fetcher, {
      staleTime: cachingEnabled ? ttl : 0,
      refetchInterval: refetchInterval ?? false,
      refetchOnWindowFocus: true,
    });

  const now = Date.now();
  const cacheAge = updatedAt ? now - updatedAt : 0;
  const hasData = data != null;

  
  const loading = isLoading && !(showSkeletonOnlyOnFirstLoad && hasData);

  
  const fromCache = hasData && !isStale;

  const forceRefresh = async () => {
    await refetch();
  };

  return {
    data: (data ?? null) as T | null,
    loading,
    error: (error as Error) ?? null,
    refetch: async () => {
      await refetch();
    },
    fromCache,
    cacheAge,
    forceRefresh,
  };
}

export function useCachedList<T>(
  fetchFn: () => Promise<T[]>,
  cacheKey: string,
  options: { ttl?: number; refetchInterval?: number } = {}
) {
  const { ttl = 300_000, refetchInterval } = options;
  return useOptimizedFetch(
    fetchFn,
    [] as const,
    Object.assign(
      {
        cacheKey,
        ttl,
        showSkeletonOnlyOnFirstLoad: true,
        backgroundRefreshThreshold: 0.5,
      },
      refetchInterval ? { refetchInterval } : {}
    ) as OptimizedFetchConfig
  );
}

export function useLiveData<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  options: { refetchInterval?: number; ttl?: number } = {}
) {
  const { refetchInterval = 30_000, ttl = 60_000 } = options;
  return useOptimizedFetch(
    fetchFn,
    [] as const,
    Object.assign(
      {
        cacheKey,
        ttl,
        showSkeletonOnlyOnFirstLoad: true,
        backgroundRefreshThreshold: 0.5,
      },
      refetchInterval ? { refetchInterval } : {}
    ) as OptimizedFetchConfig
  );
}

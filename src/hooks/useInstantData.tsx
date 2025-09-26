import { cacheClient, useCacheQuery, type Fetcher } from "@/lib/cache";
import { cacheConfig } from "@/lib/cacheConfig";

import type { UseInstantDataConfig, UseInstantDataResult } from "@/types";

/**
 * Unifica estrategia en el cliente de caché:
 * - strategy: "cache-first" | "network-first" | "cache-only"
 * - enableCache/ttl respetados
 */
export function useInstantData<T = unknown>(
  config: UseInstantDataConfig<T>
): UseInstantDataResult<T> {
  const {
    cacheKey,
    fetchFn,
    initialValue,
    ttl = 300_000,
    enableCache = true,
    strategy = "cache-first",
  } = config;

  const globalEnabled = cacheConfig.get().enabled !== false;
  const cachingEnabled = globalEnabled && enableCache;

  const enabled = strategy === "cache-only" ? false : true;

  const fetcher: Fetcher<T> = async () => fetchFn();

  const queryOptions: any = {
    enabled,
    staleTime: cachingEnabled ? ttl : 0,
    refetchOnWindowFocus: true,
  };
  if (initialValue !== undefined) {
    queryOptions.initialData = initialValue as T;
  }

  const { data, error, status, isStale, isFetching, updatedAt, refetch } =
    useCacheQuery<T>(["instant", cacheKey], fetcher, queryOptions);

  const hasData = data !== undefined && data !== null;
  const showSkeleton = status === "loading" && !hasData;
  const fromCache = hasData && !isStale;

  const refresh = async () => {
    await refetch();
  };

  const clearCache = () => {
    cacheClient.setQueryData(["instant", cacheKey], undefined as unknown as T);
    cacheClient.invalidate(["instant", cacheKey]);
  };

  const mutate = (updater: (prev: T) => T) => {
    cacheClient.setQueryData<T>(["instant", cacheKey], (prev) =>
      updater(prev as T)
    );
  };

  return {
    data: (hasData ? (data as T) : (initialValue as T)) as T,
    loading: showSkeleton,
    error: (error as Error) ?? null,
    fromCache,
    refresh,
    clearCache,
    mutate,
  };
}

// src/hooks/useInstantData.tsx
import { useCallback,useEffect, useState } from "react";
import { apiCache,globalCache } from "src/lib/cacheManager";

import type { UseInstantDataConfig, UseInstantDataResult } from "@/types";
import { getErrorMessage } from "@/utils/errors";

/** Considera utilizable el valor de cache sólo si no está vacío. */
function hasUsableCacheValue<T>(value: unknown): value is T {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object")
    return Object.keys(value as Record<string, unknown>).length > 0;
  return Boolean(value);
}

export function useInstantData<T = unknown>(
  config: UseInstantDataConfig<T>
): UseInstantDataResult<T> {
  const {
    cacheKey,
    fetchFn,
    initialValue,
    ttl = 300000, // 5 minutos
    enableCache = true,
    strategy = "cache-first",
    onCacheHit,
    onCacheMiss,
  } = config;

  // Estado inicial conservador para evitar problemas de hidratación
  const [data, setData] = useState<T>(initialValue as T);
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Verificar cache sólo después de la hidratación
  const checkCache = useCallback((): T | null => {
    if (!enableCache || !isHydrated) return null;

    const cachedRaw = apiCache.get(cacheKey) ?? globalCache.get(cacheKey);
    const usable = hasUsableCacheValue<T>(cachedRaw);

    if (usable) {
      setFromCache(true);
      onCacheHit?.(cachedRaw as T);
      return cachedRaw as T;
    }

    setFromCache(false);
    onCacheMiss?.();
    return null;
  }, [cacheKey, enableCache, onCacheHit, onCacheMiss, isHydrated]);

  // Fetch de datos desde la red
  const fetchData = useCallback(
    async (forceNetwork = false): Promise<T | null> => {
      try {
        setError(null);

        // Si no es forzado y es cache-only, no hacer request
        if (!forceNetwork && strategy === "cache-only") {
          return null;
        }

        setLoading(true);
        const result = await fetchFn();

        // Guardar en cache
        if (enableCache) {
          apiCache.set(cacheKey, result, ttl);
        }

        setFromCache(false);
        return result;
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(getErrorMessage(err)));
        setFromCache(false);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, enableCache, cacheKey, ttl, strategy]
  );

  // Lógica principal de carga
  const loadData = useCallback(async () => {
    const cached = checkCache();
    const hasUsable = hasUsableCacheValue<T>(cached);

    // Cache-first: solo usar cache si es "utilizable"
    if (hasUsable && strategy === "cache-first") {
      setData(cached as T);
      return;
    }

    // Network-first o no hay cache utilizable: fetch de red
    const networkData = await fetchData();
    if (networkData) {
      setData(networkData);
    } else if (hasUsable && strategy === "network-first") {
      // Fallback a cache si falla la red
      setData(cached as T);
      setFromCache(true);
    }
  }, [checkCache, fetchData, strategy]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    const networkData = await fetchData(true);
    if (networkData) {
      setData(networkData);
    }
  }, [fetchData]);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    apiCache.delete(cacheKey);
    globalCache.delete(cacheKey);
    setFromCache(false);
  }, [cacheKey]);

  // Efecto para detectar hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Efecto principal de carga después de la hidratación
  useEffect(() => {
    if (!isHydrated) return;

    // Verificar cache después de la hidratación
    const cached = checkCache();
    const hasUsable = hasUsableCacheValue<T>(cached);

    if (hasUsable) {
      setData(cached as T);
      setLoading(false); // No hay loading si viene de cache utilizable
      if (strategy === "cache-first") {
        return;
      }
    }

    if (!hasUsable || strategy === "network-first") {
      loadData();
    }
  }, [isHydrated, cacheKey, checkCache, loadData, strategy]);

  // Permite mutar el estado local y el cache sin refetch
  const mutate = useCallback(
    (updater: (prev: T) => T) => {
      setData((prev) => {
        const next = updater(prev);
        if (enableCache) {
          apiCache.set(cacheKey, next, ttl);
        }
        return next;
      });
      // No tocar loading/fromCache: mutación local sin red
    },
    [cacheKey, ttl, enableCache]
  );

  return {
    data,
    loading,
    error,
    fromCache,
    refresh,
    clearCache,
    mutate,
  };
}

/**
 * Hook específico para listas que elimina skeleton en navegaciones repetidas
 * y NO lo suprime cuando "el cache" está vacío.
 */
export function useInstantList<T = unknown>(
  listKey: string,
  fetchFn: () => Promise<T[]>,
  options: {
    ttl?: number;
    prefetch?: boolean;
    showSkeletonOnlyOnFirstLoad?: boolean;
  } = {}
) {
  const {
    ttl = 300000,
    prefetch: _prefetch = true,
    showSkeletonOnlyOnFirstLoad = true,
  } = options;

  const result = useInstantData<T[]>({
    cacheKey: `list_${listKey}`,
    fetchFn,
    initialValue: [],
    ttl: ttl,
    strategy: "cache-first",
    enableCache: true,
    onCacheHit: (_data: T[]) => {
      // no-op by default; callers may provide a handler
    },
    onCacheMiss: () => {},
  });

  // Si la lista está vacía, aunque venga "fromCache", consideramos que NO suprime el skeleton.
  const hasNonEmptyData = Array.isArray(result.data) && result.data.length > 0;

  const shouldShowSkeleton = showSkeletonOnlyOnFirstLoad
    ? result.loading &&
      (!result.fromCache || !hasNonEmptyData) &&
      !hasNonEmptyData
    : result.loading && !hasNonEmptyData;

  return {
    ...result,
    isEmpty: !hasNonEmptyData,
    hasData: hasNonEmptyData,
    showSkeleton: shouldShowSkeleton,
    items: result.data,
    mutateItems: result.mutate,
  };
}

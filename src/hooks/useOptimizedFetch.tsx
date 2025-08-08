import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  OptimizedFetchConfig,
  UseOptimizedFetchReturn,
} from "../types/types";
import {
  getCachedData,
  setCachedData,
  stableKey,
} from "../utils/cacheHelpers.ts";

/**
 * Hook que prioriza cache (SWR): muestra cache al instante y refresca en background.
 * - Skeleton solo en la primera carga si no hay cache.
 * - Evita carreras de peticiones con AbortController.
 */
export function useOptimizedFetch<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  params: P,
  config: OptimizedFetchConfig,
  deps?: unknown[]
): UseOptimizedFetchReturn<T> {
  const {
    cacheKey,
    ttl = 300_000, // 5 min
    storage = "memory",
    showSkeletonOnlyOnFirstLoad = true,
    refetchInterval,
    backgroundRefreshThreshold = 0.5,
  } = config;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheAge, setCacheAge] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Control de concurrencia/cancelación
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef<Promise<T> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  // Dependencias "estables": si no proveen deps, derivamos de params
  const depsKey = useMemo(
    () => (deps ? stableKey(deps) : stableKey(params)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deps ? stableKey(deps) : stableKey(params)]
  );

  const doRequest = useCallback(
    async (force = false): Promise<T> => {
      // Cache first (si no es force)
      if (!force) {
        const { data: cached, age } = getCachedData<T>(cacheKey, storage, ttl);
        if (cached != null) {
          if (mountedRef.current) {
            setData(cached);
            setFromCache(true);
            setCacheAge(age);
            setError(null);
            if (showSkeletonOnlyOnFirstLoad) {
              // SWR opcional si el cache está "viejo"
              if (age > ttl * backgroundRefreshThreshold) {
                void doRequest(true);
              }
              return cached;
            }
          }
        }
      }

      // Evitar múltiples peticiones paralelas
      if (inFlightRef.current && !force) {
        return inFlightRef.current;
      }

      // Lanzar petición
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      if (!data || force) setLoading(true);
      setError(null);

      const p = (async () => {
        const result = await requestFn(...params);
        if (!mountedRef.current || ac.signal.aborted) return result;
        setData(result);
        setFromCache(false);
        setCacheAge(0);
        setCachedData(cacheKey, storage, ttl, result);
        return result;
      })();

      inFlightRef.current = p;

      try {
        const res = await p;
        return res;
      } catch (e) {
        if (!mountedRef.current || ac.signal.aborted) {
          return Promise.reject(e);
        }
        setError(e as Error);
        setFromCache(false);
        throw e;
      } finally {
        if (mountedRef.current) setLoading(false);
        inFlightRef.current = null;
        setInitialized(true);
      }
    },
    [
      backgroundRefreshThreshold,
      cacheKey,
      data,
      params,
      requestFn,
      showSkeletonOnlyOnFirstLoad,
      storage,
      ttl,
    ]
  );

  const forceRefresh = useCallback(async () => {
    await doRequest(true);
  }, [doRequest]);

  // Carga inicial
  useEffect(() => {
    if (initialized) return;
    const { data: cached, age } = getCachedData<T>(cacheKey, storage, ttl);

    if (cached != null && showSkeletonOnlyOnFirstLoad) {
      setData(cached);
      setFromCache(true);
      setCacheAge(age);
      setLoading(false);
      setInitialized(true);

      if (age > ttl * backgroundRefreshThreshold) {
        // Refresco en background
        setTimeout(() => void forceRefresh(), 0);
      }
    } else {
      setLoading(true);
      void doRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, cacheKey, storage, ttl]);

  // Re-fetch por cambios en dependencias
  useEffect(() => {
    if (!initialized) return;
    void doRequest();
  }, [depsKey, initialized, doRequest]);

  // Intervalo de refresco (pausado si la pestaña está oculta)
  useEffect(() => {
    if (!refetchInterval || !initialized) return;

    let active = true;
    const tick = () => {
      if (!active) return;
      if (document.visibilityState === "visible" && !loading) {
        void doRequest(true);
      }
    };

    const id = setInterval(tick, refetchInterval);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      active = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refetchInterval, initialized, loading, doRequest]);

  const refetch = useCallback(async () => {
    await doRequest(true);
  }, [doRequest]);

  return {
    data,
    loading,
    error,
    refetch,
    fromCache,
    cacheAge,
    forceRefresh,
  };
}

/** Hooks específicos (puede dejarlos aquí o en archivos aparte). */
export function useCachedList<T>(
  fetchFn: () => Promise<T[]>,
  cacheKey: string,
  options: {
    ttl?: number;
    refetchInterval?: number;
  } = {}
) {
  const { ttl = 300_000, refetchInterval } = options;
  return useOptimizedFetch(fetchFn, [] as const, {
    cacheKey,
    ttl,
    showSkeletonOnlyOnFirstLoad: true,
    refetchInterval,
    backgroundRefreshThreshold: 0.5,
  });
}

export function useLiveData<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  options: { refetchInterval?: number; ttl?: number } = {}
) {
  const { refetchInterval = 30_000, ttl = 60_000 } = options;
  return useOptimizedFetch(fetchFn, [] as const, {
    cacheKey,
    ttl,
    showSkeletonOnlyOnFirstLoad: true,
    refetchInterval,
    backgroundRefreshThreshold: 0.5,
  });
}

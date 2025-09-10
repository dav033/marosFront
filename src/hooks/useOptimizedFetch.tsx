import { useCallback, useEffect, useRef, useState } from "react";
import type { StorageLayer, OptimizedFetchConfig, UseOptimizedFetchReturn } from "@/types";
import { getCachedData, setCachedData } from "../utils/cacheHelpers";
import { useIsMounted } from "./useIsMounted";
import { useAbortControllerRef } from "./useAbortControllerRef";
import { useVisibilityInterval } from "./useVisibilityInterval";
import { useStableDepsKey } from "./useStableDepsKey";
import { primeCache } from "../utils/primeCache";

export function useOptimizedFetch<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  params: P,
  config: OptimizedFetchConfig,
  deps?: unknown[]
): UseOptimizedFetchReturn<T> {
  const {
    cacheKey,
    ttl = 300_000,
    storage = "memory",
    showSkeletonOnlyOnFirstLoad = true,
    refetchInterval,
    backgroundRefreshThreshold = 0.5,
  } = config;

  // Estado de la petición
  const [data, setData] = useState<T | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheAge, setCacheAge] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Infraestructura
  const isMounted = useIsMounted();
  const { replace, signal } = useAbortControllerRef();
  const inFlightRef = useRef<Promise<T> | null>(null);

  // Dependencias estables
  const depsKey = useStableDepsKey(params as unknown[], deps);

  const doRequest = useCallback(async (force = false): Promise<T> => {
    // 1) Intentar caché si no es force
    if (!force) {
      const { data: cached, age } = getCachedData<T>(cacheKey, storage, ttl);
      if (cached != null) {
        if (isMounted.current) {
          setData(cached);
          setFromCache(true);
          setCacheAge(age);
          setError(null);
          if (showSkeletonOnlyOnFirstLoad && age > ttl * backgroundRefreshThreshold) {
            // Refresco en background, pero no bloquear retorno
            void doRequest(true);
          }
          if (showSkeletonOnlyOnFirstLoad) return cached;
        }
      }
    }

    // 2) Dedupe si hay una promesa en vuelo y no es force
    if (inFlightRef.current && !force) return inFlightRef.current;

    // 3) Preparar nueva petición
    const ac = replace();

    if (!data || force) setLoading(true);
    setError(null);

    const p = (async () => {
      const result = await requestFn(...params);
      if (!isMounted.current || ac.signal.aborted) return result;

      setData(result);
      setFromCache(false);
      setCacheAge(0);
      setCachedData(cacheKey, storage, ttl, result);
      return result;
    })();

    inFlightRef.current = p;

    try {
      return await p;
    } catch (e) {
      if (!isMounted.current || (signal && (signal as AbortSignal).aborted)) {
        return Promise.reject(e);
      }
      setError(e as Error);
      setFromCache(false);
      throw e;
    } finally {
      if (isMounted.current) setLoading(false);
      inFlightRef.current = null;
      setInitialized(true);
    }
  }, [
    backgroundRefreshThreshold,
    cacheKey,
    data,
    params,
    requestFn,
    showSkeletonOnlyOnFirstLoad,
    storage,
    ttl,
    isMounted,
    replace,
    signal,
  ]);

  const forceRefresh = useCallback(async () => { await doRequest(true); }, [doRequest]);
  const refetch = useCallback(async () => { await doRequest(true); }, [doRequest]);

  // 4) Primer render: priming desde caché y posible refresh en background
  useEffect(() => {
    if (initialized) return;
    const primed = primeCache<T>(cacheKey, storage, ttl, backgroundRefreshThreshold);

    if (primed.cached != null && showSkeletonOnlyOnFirstLoad) {
      setData(primed.cached);
      setFromCache(primed.fromCache);
      setCacheAge(primed.age);
      setLoading(false);
      setInitialized(true);

      if (primed.shouldBackgroundRefresh) {
        setTimeout(() => void forceRefresh(), 0);
      }
    } else {
      setLoading(true);
      void doRequest();
    }
  }, [
    initialized,
    cacheKey,
    storage,
    ttl,
    showSkeletonOnlyOnFirstLoad,
    backgroundRefreshThreshold,
    forceRefresh,
    doRequest,
  ]);

  // 5) Refetch al cambiar depsKey (params/deps)
  useEffect(() => {
    if (!initialized) return;
    void doRequest();
  }, [depsKey, initialized, doRequest]);

  // 6) Programación: intervalo + visibilidad
  useVisibilityInterval({
    interval: refetchInterval,
    enabled: Boolean(refetchInterval && initialized && !loading),
    tick: async () => { await doRequest(true); },
  });

  return { data, loading, error, refetch, fromCache, cacheAge, forceRefresh };
}

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
    storage: "memory",
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
    storage: "memory",
    showSkeletonOnlyOnFirstLoad: true,
    refetchInterval,
    backgroundRefreshThreshold: 0.5,
  });
}

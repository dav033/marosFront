// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from "react";

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetch<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  params: P,
  deps?: unknown[],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Si no pasan deps, que dependa de params
  const actualDeps = deps ?? params;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn(...params);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [requestFn, ...actualDeps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

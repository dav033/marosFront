import type { UseFetchResult } from "@/types";
import { useState, useEffect, useCallback } from "react";

export function useFetch<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  params: P,
  deps?: unknown[]
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true); // Iniciamos en true para mostrar skeleton inmediatamente
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn(...params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setData(null); // Limpiar data en caso de error
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestFn, ...params, ...(deps ?? [])]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, mutate, reset };
}

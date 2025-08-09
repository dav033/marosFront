import type { UseFetchResult } from "@/types/domain";
import { useState, useEffect, useCallback } from "react";

export function useFetch<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  params: P,
  deps?: unknown[]
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true); // Iniciamos en true para mostrar skeleton inmediatamente
  const [error, setError] = useState<Error | null>(null);

  const actualDeps = deps ?? params;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn(...params);
      setData(result);
    } catch (err) {
      setError(err as Error);
      setData(null); // Limpiar data en caso de error
    } finally {
      setLoading(false);
    }
  }, [requestFn, ...actualDeps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

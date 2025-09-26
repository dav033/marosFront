import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSyncExternalStore } from "react";
import { cacheClient } from "./CacheClient";
import type { Fetcher, QueryOptions } from "./types";
import type { QueryKey } from "./key";

export function useCacheQuery<TData>(
  queryKey: QueryKey,
  fetcher: Fetcher<TData>,
  options: QueryOptions<TData> = {}
) {
  // Opciones estables
  const opts = useMemo(() => options, [JSON.stringify(options)]);
  // Hash estable para dependencias (evita referencialidad cambiante de arrays/objetos en queryKey)
  const keyHash = useMemo(() => JSON.stringify(queryKey), [JSON.stringify(queryKey)]);

  // Suscripción a la store
  const subscribe = useCallback(
    (onStoreChange: () => void) => cacheClient.subscribe(queryKey, onStoreChange, opts),
    [keyHash, JSON.stringify(opts)]
  );

  // Lectura de snapshot en el cliente
  const getSnapshot = useCallback(
    () => cacheClient.getSnapshot<TData>(queryKey, opts),
    [keyHash, JSON.stringify(opts)]
  );

  // IMPORTANTÍSIMO: cachear el snapshot del servidor para evitar bucles en SSR/hidratación
  const serverSnapRef = useRef(getSnapshot());
  const getServerSnapshot = useCallback(() => serverSnapRef.current, []);

  // Estado externo sincronizado
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { data, error, status, updatedAt, isStale, isFetching } = snap;

  // Disparar fetch inicial / cuando no hay datos aún
  useEffect(() => {
    const enabled = opts.enabled ?? true;
    if (!enabled) return;

    // Evita bucle con staleTime === 0:
    // - Si está idle y no hay fetch en curso -> dispara
    // - O si está stale y NO hay datos aún -> dispara
    if ((status === "idle" && !isFetching) || (!data && isStale && !isFetching)) {
      cacheClient.ensureQuery(queryKey, fetcher, opts).catch(() => {});
    }
  }, [status, isStale, isFetching, !!data, keyHash, JSON.stringify(opts), fetcher, queryKey]);

  // Polling opcional, condicionado a visibilidad
// Polling opcional, condicionado a visibilidad
useEffect(() => {
  const interval = opts.refetchInterval;
  // Aceptamos sólo números válidos; salimos si es false o undefined/null
  if (interval === false || interval == null) return;

  let id: ReturnType<typeof setInterval> | undefined;
  let cancelled = false;

  const tick = () => {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    cacheClient.refetch(queryKey, fetcher, opts).catch(() => {});
  };

  id = setInterval(() => { if (!cancelled) tick(); }, interval);
  return () => { cancelled = true; if (id) clearInterval(id); };
  // deps
}, [keyHash, opts.refetchInterval, JSON.stringify(opts), fetcher, queryKey]);

  const refetch = useCallback(
    () => cacheClient.refetch(queryKey, fetcher, opts),
    [keyHash, JSON.stringify(opts), fetcher, queryKey]
  );

  return {
    data: data as TData | undefined,
    error,
    status,
    updatedAt,
    isStale,
    isFetching,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    refetch,
  };
}

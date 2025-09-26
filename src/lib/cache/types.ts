// types.ts
export type Status = "idle" | "loading" | "success" | "error";

export interface QueryOptions<TData> {
  staleTime?: number; // ms; 0 = siempre stale
  gcTime?: number; // ms; tiempo en memoria después de no tener subs
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false; // ms o false
  initialData?: TData;
  enabled?: boolean; // permite condicionar el fetch
}

export type Fetcher<TData> = (ctx: {
  signal: AbortSignal;
  queryKey: readonly unknown[];
}) => Promise<TData>;

export interface SetDataOptions {
  // Si true, no notifica si shallowEqual(dataAnterior, dataNueva)
  // (para evitar renders innecesarios en mutaciones "in place")
  silentIfEqual?: boolean;
}

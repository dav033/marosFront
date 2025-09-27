// src/lib/cache/types.ts
export type Status = 'loading' | 'success' | 'error';

export type Fetcher<T> = () => Promise<T>;

export type QueryOptions<T> = {
  staleTime?: number;
  /** v5 */
  gcTime?: number;
  /** v4 (si lo necesita) */
  cacheTime?: number;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
};

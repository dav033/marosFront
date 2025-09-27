// src/lib/cache/useCacheQuery.tsx
import { useQuery } from '@tanstack/react-query';
import type { Fetcher, QueryOptions } from './types';
import type { QueryKey } from './key';

export function useCacheQuery<TData>(
  queryKey: QueryKey,
  fetcher: Fetcher<TData>,
  options: QueryOptions<TData> = {}
) {
  // Construimos las opciones sin incluir props "undefined" (requisito con exactOptionalPropertyTypes)
  const rqOptions: Record<string, unknown> = {
    queryKey,
    queryFn: fetcher,
  };

  if (options.staleTime !== undefined) rqOptions['staleTime'] = options.staleTime;

  // Compatibilidad v5 (gcTime) y v4 (cacheTime). Solo incluimos una, y solo si viene definida.
  if (options.gcTime !== undefined) {
    rqOptions['gcTime'] = options.gcTime;
  } else if (options.cacheTime !== undefined) {
    // Para proyectos en React Query v4
    // Para proyectos en React Query v4
    rqOptions['cacheTime'] = options.cacheTime;
  }

  if (options.refetchInterval !== undefined) rqOptions['refetchInterval'] = options.refetchInterval;
  if (options.refetchOnWindowFocus !== undefined) rqOptions['refetchOnWindowFocus'] = options.refetchOnWindowFocus;
  if (options.enabled !== undefined) rqOptions['enabled'] = options.enabled;

  // Tipado laxo aquí para convivir con v4/v5 sin bifurcar código
  const q: any = useQuery<TData>(rqOptions as any);

  // v5: status 'pending' | 'success' | 'error'
  // v4: status 'loading' | 'success' | 'error'
  const status: string | undefined = q.status;
  const mappedStatus: 'loading' | 'success' | 'error' =
    status === 'pending'
      ? 'loading'
      : status === 'loading'
      ? 'loading'
      : status === 'error'
      ? 'error'
      : 'success';

  return {
    data: q.data as TData | undefined,
    error: (q.error as unknown) ?? null,
    status: mappedStatus,
    updatedAt: (q.dataUpdatedAt as number) ?? 0,
    isStale: !!q.isStale,
    isFetching: !!q.isFetching,
    // v4 usa isLoading; v5 usa isPending; soportamos ambos
    isLoading: typeof q.isLoading === 'boolean' ? q.isLoading : !!q.isPending,
    isSuccess: !!q.isSuccess,
    isError: !!q.isError,
    refetch: q.refetch as () => Promise<any>,
  } as const;
}

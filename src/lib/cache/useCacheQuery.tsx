
import { useQuery } from '@tanstack/react-query';
import type { Fetcher, QueryOptions } from './types';
import type { QueryKey } from './key';

export function useCacheQuery<TData>(
  queryKey: QueryKey,
  fetcher: Fetcher<TData>,
  options: QueryOptions<TData> = {}
) {
  
  const rqOptions: Record<string, unknown> = {
    queryKey,
    queryFn: fetcher,
  };

  if (options.staleTime !== undefined) rqOptions['staleTime'] = options.staleTime;

  
  if (options.gcTime !== undefined) {
    rqOptions['gcTime'] = options.gcTime;
  } else if (options.cacheTime !== undefined) {
    
    
    rqOptions['cacheTime'] = options.cacheTime;
  }

  if (options.refetchInterval !== undefined) rqOptions['refetchInterval'] = options.refetchInterval;
  if (options.refetchOnWindowFocus !== undefined) rqOptions['refetchOnWindowFocus'] = options.refetchOnWindowFocus;
  if (options.enabled !== undefined) rqOptions['enabled'] = options.enabled;

  
  const q: any = useQuery<TData>(rqOptions as any);

  
  
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
    
    isLoading: typeof q.isLoading === 'boolean' ? q.isLoading : !!q.isPending,
    isSuccess: !!q.isSuccess,
    isError: !!q.isError,
    refetch: q.refetch as () => Promise<any>,
  } as const;
}

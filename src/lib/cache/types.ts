
export type Status = 'loading' | 'success' | 'error';

export type Fetcher<T> = () => Promise<T>;

export type QueryOptions<T> = {
  staleTime?: number;
    gcTime?: number;
    cacheTime?: number;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
};

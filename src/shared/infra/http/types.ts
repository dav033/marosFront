import type { AxiosRequestHeaders } from 'axios';

export type CacheStrategy =
  | 'cache-first'
  | 'network-first'
  | 'cache-only'
  | 'network-only';

export interface CachedRequestConfig {
  params?: Record<string, unknown>;

  headers?: AxiosRequestHeaders | Record<string, string>;

  withCredentials?: boolean;

  signal?: AbortSignal;

  cache?: {
    enabled?: boolean;
    strategy?: CacheStrategy;
    ttl?: number;
  };
}

export type RequestOptions = {
  params?: Record<string, unknown>;
  headers?: AxiosRequestHeaders | Record<string, string>;
  withCredentials?: boolean;
  signal?: AbortSignal;
};

/**
 * Contrato mínimo que cumplen nuestros clientes HTTP (e.g. optimizedApiClient).
 */
export interface HttpClientLike {
  get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<{ data: T; status: number }>;
  post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<{ data: T; status: number }>;
  put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<{ data: T; status: number }>;
  delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<{ data: T; status: number }>;
}

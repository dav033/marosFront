// src/shared/infra/http/types.ts
import type { AxiosRequestHeaders } from "axios";

export type CacheStrategy =
  | "cache-first"
  | "network-first"
  | "cache-only"
  | "network-only";

export interface CachedRequestConfig {
  /**
   * Parámetros de consulta (usados para generar la cacheKey también)
   */
  params?: Record<string, unknown>;

  /**
   * Headers a enviar. Puede usar un objeto plano; se castea a AxiosRequestHeaders al construir la request.
   */
  headers?: AxiosRequestHeaders | Record<string, string>;

  /**
   * Control de credenciales; por defecto true.
   */
  withCredentials?: boolean;

  /**
   * AbortSignal opcional para cancelar la petición.
   */
  signal?: AbortSignal;

  /**
   * Configuración de cache para la request.
   */
  cache?: {
    enabled?: boolean;
    strategy?: CacheStrategy;
    ttl?: number; // milisegundos
  };

  /**
   * Sugerencias de prefetch de recursos dependientes
   */
  prefetch?: {
    dependencies?: string[];
  };
}

export interface RequestMetrics {
  cacheHits: number;
  cacheMisses: number;
  networkRequests: number;
  failedRequests: number;
  totalRequests: number;
  averageResponseTime: number;
  prefetchSuccess: number;
  prefetchFailed: number;
}

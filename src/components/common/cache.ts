// Métricas genéricas de un caché. Acepta campos adicionales sin romper el tipado.
export interface CacheGauge {
  size: number;
  expired: number;
  // Campos comunes que a veces exponemos:
  hits?: number;
  misses?: number;
  valid?: number;
  maxSize?: number;
  oldestEntry?: number | null;
  newestEntry?: number | null;
  // Permite contadores extra sin romper:
  [k: string]: number | null | undefined;
}

// Métricas que suele exponer el prefetch manager. Flexibles por backend.
export interface PrefetchStats {
  total?: number;
  prefetches?: number;
  completed?: number;
  successful?: number;
  failed?: number;
  // Permite contadores extra sin romper:
  [k: string]: number | undefined;
}

// Conjunto de métricas que usamos en el CacheInitializer.
export interface CacheMetrics {
  globalCache: CacheGauge;
  apiCache: CacheGauge;
  prefetch: PrefetchStats;

  // Opcional: si en el futuro quieres métricas del cliente, puedes usarlas.
  client?: {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
  };
}

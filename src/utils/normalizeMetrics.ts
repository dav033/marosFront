// src/utils/normalizeMetrics.ts
import type { CacheMetrics } from "../types/cache";

export function normalizeMetrics(raw: any): CacheMetrics & { hitRate: number } {
  const total = raw.totalRequests ?? (raw.hits ?? 0) + (raw.misses ?? 0);
  const hits = raw.cacheHits ?? raw.hits ?? 0;
  const misses = raw.cacheMisses ?? raw.misses ?? 0;
  const evictions = raw.evictions ?? raw.evicts ?? 0;
  const denom = total || hits + misses || 1;
  return {
    ...raw,
    totalRequests: denom,
    cacheHits: hits,
    cacheMisses: misses,
    evictions,
    hitRate: hits / denom,
  };
}

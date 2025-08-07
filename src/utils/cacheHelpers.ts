import { apiCache } from "../lib/cacheManager";
import type { StorageLayer } from "../types/types";

type CachedResult<T> = { data: T | null; age: number };

const WEB_KEY = (key: string) => `cache_${key}`;

/** Lee desde cache unificado (memory / web storage) y calcula age. */
export function getCachedData<T>(
  cacheKey: string,
  storage: StorageLayer,
  ttl: number
): CachedResult<T> {
  try {
    if (storage === "memory") {
      const cached = apiCache.get(cacheKey) as T | undefined;
      if (cached !== undefined && cached !== null) {
        // Intento obtener age si la implementación expone metadata interna (defensivo)
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const entry = (apiCache as any).cache?.get?.(cacheKey);
          const ts: number | undefined = entry?.timestamp ?? entry?._timestamp;
          const age = ts ? Date.now() - ts : 0;
          return { data: cached as T, age };
        } catch {
          return { data: cached as T, age: 0 };
        }
      }
    } else {
      const box = storage === "local" ? localStorage : sessionStorage;
      const raw = box.getItem(WEB_KEY(cacheKey));
      if (raw) {
        const parsed = JSON.parse(raw) as { data: T; timestamp: number };
        const age = Date.now() - parsed.timestamp;
        if (age < ttl) return { data: parsed.data, age };
        // Expirado
        box.removeItem(WEB_KEY(cacheKey));
      }
    }
  } catch (e) {
    console.warn(`[useOptimizedFetch] Error reading cache ${cacheKey}:`, e);
  }
  return { data: null, age: 0 };
}

/** Escribe en cache unificado. */
export function setCachedData<T>(
  cacheKey: string,
  storage: StorageLayer,
  ttl: number,
  data: T
): void {
  try {
    if (storage === "memory") {
      apiCache.set(cacheKey, data, ttl);
    } else {
      const box = storage === "local" ? localStorage : sessionStorage;
      box.setItem(
        WEB_KEY(cacheKey),
        JSON.stringify({ data, timestamp: Date.now() })
      );
    }
  } catch (e) {
    console.warn(`[useOptimizedFetch] Error saving cache ${cacheKey}:`, e);
  }
}

/** Serializa dependencias de forma estable (para arrays/objetos simples). */
export function stableKey(input: unknown): string {
  try {
    return JSON.stringify(input, (_k, v) =>
      typeof v === "function" ? "[fn]" : v
    );
  } catch {
    return String(input);
  }
}

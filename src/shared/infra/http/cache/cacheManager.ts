// src/shared/infra/http/cache/cacheManager.ts
type Entry<T> = { value: T; ts: number; ttl: number };

export class SimpleLRUCache {
  private map = new Map<string, Entry<unknown>>();
  constructor(private capacity = 500) {}

  private evictIfNeeded() {
    while (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value;
      if (typeof oldestKey === "string") {
        this.map.delete(oldestKey);
      }
    }
  }

  set<T>(key: string, value: T, ttl: number) {
    this.map.delete(key); // refresca orden LRU
    this.map.set(key, { value, ts: Date.now(), ttl });
    this.evictIfNeeded();
  }

  /** Devuelve solo si NO está expirado y refresca orden LRU */
  getFresh<T>(key: string): { value: T; age: number } | null {
    const e = this.map.get(key);
    if (!e) return null;
    const age = Date.now() - e.ts;
    if (age > e.ttl) return null;
    this.map.delete(key);
    this.map.set(key, e);
    return { value: e.value as T, age };
  }

  /** Devuelve aunque esté expirado (útil para SWR). No refresca orden. */
  peekAny<T>(key: string): { value: T; age: number; fresh: boolean } | null {
    const e = this.map.get(key);
    if (!e) return null;
    const age = Date.now() - e.ts;
    return { value: e.value as T, age, fresh: age <= e.ttl };
  }

  delete(key: string) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
  size() {
    return this.map.size;
  }
}

export const unifiedCache = new SimpleLRUCache(500);

// ⚠️ Compat: exportar alias para código legado que importe apiCache/globalCache.
export const apiCache = unifiedCache;
export const globalCache = unifiedCache; // DEPRECATED

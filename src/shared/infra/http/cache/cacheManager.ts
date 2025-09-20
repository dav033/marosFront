// src/shared/infra/http/cache/cacheManager.ts
type Entry<T> = { value: T; expiresAt?: number };

class MemoryCache<T = unknown> {
  private store = new Map<string, Entry<T>>();
  private stats = { size: 0, hits: 0, misses: 0 };

  get(key: string): T | null {
    const e = this.store.get(key);
    if (!e) {
      this.stats.misses++;
      return null;
    }
    if (e.expiresAt && Date.now() > e.expiresAt) {
      this.store.delete(key);
      this.stats.size = this.store.size;
      this.stats.misses++;
      return null;
    }
    this.stats.hits++;
    return e.value;
  }

  set(key: string, value: T, ttl?: number): void {
    const expiresAt = ttl && ttl > 0 ? Date.now() + ttl : undefined;
    this.store.set(key, { value, expiresAt });
    this.stats.size = this.store.size;
  }

  clear(): void {
    this.store.clear();
    this.stats.size = 0;
  }

  /** Elimina todas las entradas cuyo key haga match con el regex. */
  invalidatePattern(regex: RegExp): number {
    let count = 0;
    for (const k of this.store.keys()) {
      if (regex.test(k)) {
        this.store.delete(k);
        count++;
      }
    }
    this.stats.size = this.store.size;
    return count;
  }

  getStats() {
    return { ...this.stats };
  }
}

// Dos caches como en tu cliente original
export const apiCache = new MemoryCache<unknown>();
export const globalCache = new MemoryCache<unknown>();

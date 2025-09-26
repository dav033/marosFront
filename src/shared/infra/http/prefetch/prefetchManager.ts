

export type PrefetchFn = (url: string) => Promise<void>;

export type PrefetchStats = {
  queued: number;          // total de solicitudes encoladas (histórico)
  inFlight: number;        // cantidad actualmente en curso
  finished: number;        // completadas con éxito (histórico)
  failed: number;          // fallidas (histórico)
  deduped: number;         // saltadas por deduplicación
  lastPrefetchAt: number | null; // timestamp último prefetch
  lastCleanup: number | null;    // timestamp último cleanup
};

export class PrefetchManager {
  private requester: PrefetchFn | null = null;
  private inFlight = new Set<string>();
  private seen = new Map<string, number>(); // url -> timestamp último intento

  private _stats: PrefetchStats = {
    queued: 0,
    inFlight: 0,
    finished: 0,
    failed: 0,
    deduped: 0,
    lastPrefetchAt: null,
    lastCleanup: null,
  };

    setRequester(fn: PrefetchFn) {
    this.requester = fn;
  }

    async prefetch(url: string, opts?: { dedupTTL?: number }): Promise<void> {
    if (!url) return;

    const now = Date.now();
    const ttl = opts?.dedupTTL ?? 5 * 60 * 1000; // 5 minutos

    const last = this.seen.get(url);
    if (last && now - last < ttl) {
      this._stats.deduped++;
      return;
    }
    this.seen.set(url, now);

    this._stats.queued++;
    this.inFlight.add(url);
    this._stats.inFlight = this.inFlight.size;

    try {
      if (this.requester) {
        await this.requester(url);
      }
      this._stats.finished++;
    } catch {
      this._stats.failed++;
    } finally {
      this.inFlight.delete(url);
      this._stats.inFlight = this.inFlight.size;
      this._stats.lastPrefetchAt = Date.now();
    }
  }

    async prefetchMany(urls: string[], opts?: { dedupTTL?: number }): Promise<void> {
    if (!Array.isArray(urls) || urls.length === 0) return;
    await Promise.all(urls.map((u) => this.prefetch(u, opts)));
  }

    cleanup(olderThanMs: number = 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [u, ts] of this.seen) {
      if (now - ts > olderThanMs) this.seen.delete(u);
    }
    this.inFlight.clear();
    this._stats.inFlight = 0;
    this._stats.lastCleanup = now;
  }

    getStats<T extends object = PrefetchStats>(): T {
    return { ...this._stats } as unknown as T;
  }
}
export const prefetchManager = new PrefetchManager();

// '@/shared/infra/http/prefetch/prefetchManager.ts'

/**
 * Gestor simple de prefetch sin dependencias de red.
 * OptimizedApiClient inyecta el "requester" para evitar importaciones cíclicas.
 */

export type PrefetchFn = (url: string) => Promise<void>;

/** Métricas de prefetch compatibles con usos comunes en dashboards */
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

  // Estructuras internas para métricas y deduplicación
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

  /**
   * Inyección del requester por parte de la capa HTTP (evita ciclos).
   */
  setRequester(fn: PrefetchFn) {
    this.requester = fn;
  }

  /**
   * Prefetch de una URL con deduplicación temporal opcional.
   * @param url
   * @param opts.dedupTTL Tiempo (ms) para evitar prefetch repetidos (default: 5 min)
   */
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
      // Silencioso por diseño: el prefetch no debe romper el flujo
    } finally {
      this.inFlight.delete(url);
      this._stats.inFlight = this.inFlight.size;
      this._stats.lastPrefetchAt = Date.now();
    }
  }

  /**
   * Prefetch de múltiples URLs.
   */
  async prefetchMany(urls: string[], opts?: { dedupTTL?: number }): Promise<void> {
    if (!Array.isArray(urls) || urls.length === 0) return;
    await Promise.all(urls.map((u) => this.prefetch(u, opts)));
  }

  /**
   * Limpieza ligera: purga referencias antiguas de deduplicación y
   * restablece contadores en curso. No toca capas de caché.
   * @param olderThanMs Purga 'seen' más antiguos que este umbral (default: 1 hora)
   */
  cleanup(olderThanMs: number = 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [u, ts] of this.seen) {
      if (now - ts > olderThanMs) this.seen.delete(u);
    }
    // Garantiza consistencia de inFlight y marca timestamp
    this.inFlight.clear();
    this._stats.inFlight = 0;
    this._stats.lastCleanup = now;
  }

  /**
   * Exposición de métricas (genérica para compatibilidad estructural).
   * El genérico permite que el consumidor proyecte otro tipo si lo necesita.
   */
  getStats<T extends object = PrefetchStats>(): T {
    // Devolvemos una copia para evitar mutaciones externas
    return { ...this._stats } as unknown as T;
  }
}

// Singleton
export const prefetchManager = new PrefetchManager();

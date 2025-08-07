/**
 * Sistema de Cache avanzado para la aplicación
 * Soporta múltiples estrategias de cache, TTL, y limpieza automática
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en milliseconds
  key: string;
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number; // 5 minutos por defecto
  storage: 'memory' | 'sessionStorage' | 'localStorage';
}

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private cleanupInterval: number | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 15 * 60 * 1000, // 15 minutos
      storage: 'memory',
      ...config
    };

    // Iniciar limpieza automática cada minuto
    this.startCleanup();
    
    // Cargar cache persistente si está configurado
    if (this.config.storage !== 'memory') {
      this.loadFromStorage();
    }
  }

  /**
   * Obtener un elemento del cache
   */
  get<T>(key: string): T | null {
    const entry = this.getEntry<T>(key);
    if (!entry) return null;

    // Verificar si ha expirado
    if (this.isExpired(entry)) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Guardar un elemento en el cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const actualTTL = ttl || this.config.defaultTTL;
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: actualTTL,
      key
    };

    // Si estamos en el límite, eliminar el más antiguo
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
    this.saveToStorage();
  }

  /**
   * Eliminar un elemento del cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  /**
   * Limpiar todo el cache
   */
  clear(): void {
    this.cache.clear();
    this.clearStorage();
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const expired = entries.filter(entry => this.isExpired(entry)).length;
    
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      expired,
      valid: this.cache.size - expired,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
    };
  }

  /**
   * Invalidar entradas por patrón
   */
  invalidatePattern(pattern: string | RegExp): number {
    let deleted = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
        deleted++;
      }
    }
    
    return deleted;
  }

  private getEntry<T>(key: string): CacheEntry<T> | null {
    if (this.config.storage === 'memory') {
      return this.cache.get(key) || null;
    }

    // Para storage persistente, intentar cargar del storage
    const storage = this.getStorage();
    if (!storage) return this.cache.get(key) || null;

    try {
      const stored = storage.getItem(`cache_${key}`);
      if (stored) {
        const entry = JSON.parse(stored);
        // Actualizar cache en memoria
        this.cache.set(key, entry);
        return entry;
      }
    } catch (error) {
      console.warn('Error loading from storage:', error);
    }

    return this.cache.get(key) || null;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private startCleanup(): void {
    if (this.cleanupInterval || typeof window === 'undefined') return;

    this.cleanupInterval = window.setInterval(() => {
      const keysToDelete: string[] = [];
      
      for (const [key, entry] of this.cache.entries()) {
        if (this.isExpired(entry)) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.delete(key));
    }, 60000); // Limpiar cada minuto
  }

  private saveToStorage(): void {
    if (this.config.storage === 'memory') return;

    const storage = this.getStorage();
    if (!storage) return;

    try {
      // Guardar solo entradas válidas
      for (const [key, entry] of this.cache.entries()) {
        if (!this.isExpired(entry)) {
          storage.setItem(`cache_${key}`, JSON.stringify(entry));
        }
      }
    } catch (error) {
      console.warn('Error saving to storage:', error);
    }
  }

  private loadFromStorage(): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith('cache_')) {
          const actualKey = key.replace('cache_', '');
          const stored = storage.getItem(key);
          if (stored) {
            const entry = JSON.parse(stored);
            if (!this.isExpired(entry)) {
              this.cache.set(actualKey, entry);
            } else {
              storage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error loading from storage:', error);
    }
  }

  private clearStorage(): void {
    const storage = this.getStorage();
    if (!storage) return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key));
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return this.config.storage === 'localStorage' ? localStorage : sessionStorage;
    } catch {
      return null;
    }
  }

  /**
   * Cleanup al destruir la instancia
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Función para crear instancias de cache que solo se ejecuta en el cliente
function createGlobalCache() {
  if (typeof window === 'undefined') {
    // Retornar un mock para el servidor
    return {
      get: () => null,
      set: () => {},
      delete: () => {},
      clear: () => {},
      has: () => false,
      getStats: () => ({ size: 0, hits: 0, misses: 0, expired: 0 }),
      cleanup: () => {},
      destroy: () => {}
    } as any;
  }
  
  return new CacheManager({
    maxSize: 200,
    defaultTTL: 15 * 60 * 1000, // 15 minutos
    storage: 'sessionStorage'
  });
}

function createApiCache() {
  if (typeof window === 'undefined') {
    // Retornar un mock para el servidor
    return {
      get: () => null,
      set: () => {},
      delete: () => {},
      clear: () => {},
      has: () => false,
      getStats: () => ({ size: 0, hits: 0, misses: 0, expired: 0 }),
      cleanup: () => {},
      destroy: () => {}
    } as any;
  }
  
  return new CacheManager({
    maxSize: 50,
    defaultTTL: 2 * 60 * 1000, // 2 minutos
    storage: 'memory'
  });
}

// Instancias globales - lazy loading
export const globalCache = createGlobalCache();
export const apiCache = createApiCache();
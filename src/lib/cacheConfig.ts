// Lightweight global cache configuration module used by the debug panel
// Provides get/set helpers and simple persistence in localStorage.

export type CacheResourceKey = 'contacts' | 'leads' | 'projectTypes';

export interface CacheResourceConfig {
  enabled: boolean;
  ttl: number; // ms
}

export interface DebugConfig {
  logCacheHits: boolean;
  logCacheMisses: boolean;
}

export interface CacheConfigShape {
  enabled: boolean;
  resources: Record<CacheResourceKey, CacheResourceConfig>;
  debug: DebugConfig;
}

const DEFAULT_CONFIG: CacheConfigShape = {
  enabled: true,
  resources: {
    contacts: { enabled: true, ttl: 15 * 60 * 1000 }, // 15m
    leads: { enabled: true, ttl: 15 * 60 * 1000 }, // 15m
    projectTypes: { enabled: true, ttl: 10 * 60 * 1000 }, // 10m
  },
  debug: {
    logCacheHits: false,
    logCacheMisses: false,
  },
};

const STORAGE_KEY = 'app.cache.config';

function readPersisted(): CacheConfigShape | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Shallow validation to avoid corrupt states
    if (typeof parsed?.enabled === 'boolean' && parsed.resources) {
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        resources: { ...DEFAULT_CONFIG.resources, ...parsed.resources },
        debug: { ...DEFAULT_CONFIG.debug, ...(parsed.debug || {}) },
      } as CacheConfigShape;
    }
    return null;
  } catch {
    return null;
  }
}

function persist(config: CacheConfigShape) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

let state: CacheConfigShape = readPersisted() || DEFAULT_CONFIG;

export const cacheConfig = {
  get(): CacheConfigShape {
    return state;
  },
  set(partial: Partial<CacheConfigShape>) {
    state = {
      ...state,
      ...partial,
      resources: partial.resources
        ? { ...state.resources, ...partial.resources }
        : state.resources,
      debug: partial.debug
        ? { ...state.debug, ...partial.debug }
        : state.debug,
    };
    persist(state);
  },
  setResource(resource: CacheResourceKey, partial: Partial<CacheResourceConfig>) {
    state = {
      ...state,
      resources: {
        ...state.resources,
        [resource]: { ...state.resources[resource], ...partial },
      },
    };
    persist(state);
  },
  reset() {
    state = { ...DEFAULT_CONFIG };
    persist(state);
  },
};

export default cacheConfig;

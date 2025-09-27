export type CacheResourceKey = string;

export interface CacheResourceConfig {
  ttl?: number;
  enabled?: boolean;
}

export interface CacheDebugConfig {
  log?: boolean;
  logCacheHits?: boolean;
  logCacheMisses?: boolean;
}

export interface CacheConfigShape {
  enabled: boolean;
  resources: Record<CacheResourceKey, CacheResourceConfig>;
  debug?: CacheDebugConfig | undefined;
}

export const DEFAULT_CONFIG: CacheConfigShape = {
  enabled: true,
  resources: {},
  debug: { log: false, logCacheHits: false, logCacheMisses: false },
};

const STORAGE_KEY = "app.cache.config";

function readPersisted(): CacheConfigShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CacheConfigShape>;
    if (typeof parsed?.enabled === "boolean" && parsed.resources) {
      const parsedDebug = (parsed.debug ?? {}) as Partial<CacheDebugConfig>;
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        resources: {
          ...DEFAULT_CONFIG.resources,
          ...(parsed.resources ?? {}),
        },
        debug: {
          ...DEFAULT_CONFIG.debug,
          ...parsedDebug,
        },
      };
    }
    return null;
  } catch {
    return null;
  }
}

function persist(config: CacheConfigShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
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
        ? { ...(state.debug ?? {}), ...partial.debug }
        : state.debug,
    };
    persist(state);
  },
  setResource(
    resource: CacheResourceKey,
    partial: Partial<CacheResourceConfig>
  ) {
    state = {
      ...state,
      resources: {
        ...state.resources,
        [resource]: {
          ...(state.resources[resource] ?? {}),
          ...(partial ?? {}),
        },
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

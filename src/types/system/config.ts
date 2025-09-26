export type CacheResourceKey = "contacts" | "leads" | "projectTypes";

export interface CacheResourceConfig {
  enabled: boolean;
  ttl: number; 
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

export interface CacheDebugConfig {
  enabled: boolean;
  logHits: boolean;
  logMisses: boolean;
  logEvictions: boolean;
  logSize: boolean;
}

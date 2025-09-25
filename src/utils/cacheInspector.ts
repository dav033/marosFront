import { apiCache, globalCache } from "@/shared/infra/http/cache/cacheManager";
import { getErrorMessage } from "@/utils/errors";

export const CacheInspector = {
  inspectGlobalCache() {
    console.log("🔍 GLOBAL CACHE INSPECTION");
    console.log("=========================");

    if (typeof window === "undefined") {
      console.log("❌ No disponible en servidor");
      return;
    }

    const stats = globalCache.getStats?.();
    console.log("📊 Estadísticas:", stats);

    const cacheKeys = Object.keys(sessionStorage).filter((key) => key.startsWith("cache_"));
    console.log(`📦 Elementos en sessionStorage: ${cacheKeys.length}`);

    for (const key of cacheKeys) {
      try {
        const actualKey = key.replace("cache_", "");
        const raw = sessionStorage.getItem(key) ?? "";
        const data = raw ? JSON.parse(raw) : { data: null, timestamp: 0, ttl: 0 };
        const isExpired = Date.now() - (data.timestamp ?? 0) > (data.ttl ?? 0);

        console.log(`\n🔑 Key: ${actualKey}`);
        console.log(`⏰ Timestamp: ${new Date(data.timestamp ?? 0).toLocaleString()}`);
        console.log(`⏳ TTL: ${((data.ttl ?? 0) / 1000).toFixed(0)}s`);
        console.log(`${isExpired ? "❌ EXPIRED" : "✅ VALID"}`);
        console.log(`📄 Data preview:`, data.data?.length ? `${data.data.length} items` : data.data);
      } catch (error: unknown) {
        console.warn(`⚠️ Error parsing ${key}:`, getErrorMessage(error));
      }
    }
  },

  inspectApiCache() {
    console.log("\n🔍 API CACHE INSPECTION");
    console.log("======================");

    const stats = apiCache.getStats?.();
    console.log("📊 Estadísticas:", stats);
  },

  clearAllCache() {
    console.log("🧹 Limpiando todo el cache...");
    globalCache.clear?.();
    apiCache.clear?.();
    console.log("✅ Cache limpiado");
  },

  getCacheSize() {
    if (typeof window === "undefined") return 0;

    let totalSize = 0;
    const cacheKeys = Object.keys(sessionStorage).filter((key) => key.startsWith("cache_"));
    for (const key of cacheKeys) {
      const value = sessionStorage.getItem(key) ?? "";
      totalSize += new Blob([value]).size;
    }

    console.log(`💾 Tamaño total del cache: ${(totalSize / 1024).toFixed(2)} KB`);
    return totalSize;
  },

  watchCache() {
    if (typeof window === "undefined") return;
    console.log("👀 Iniciando monitoreo del cache...");

    const originalSet = globalCache.set?.bind(globalCache);
    const originalGet = globalCache.get?.bind(globalCache);

    if (typeof originalSet === "function") {
      const getLength = (x: unknown): number | undefined => {
        if (typeof x === 'object' && x !== null && 'length' in x) {
          const val = (x as { length: unknown }).length;
          return typeof val === 'number' ? val : undefined;
        }
        return undefined;
      };

      globalCache.set = (function (key: string, data: unknown, ttl?: number) {
        console.log(`📝 Cache SET: ${key}`, { dataLength: getLength(data) ?? "N/A", ttl });
        return originalSet(key, data, ttl);
      }) as unknown as typeof globalCache.set;
    }

    if (typeof originalGet === "function") {
      globalCache.get = (function <T>(key: string): T | null {
        const result = originalGet(key) as T | null;
        console.log(`📖 Cache GET: ${key}`, result ? "✅ HIT" : "❌ MISS");
        return result;
      }) as unknown as typeof globalCache.get;
    }
  },
};

if (typeof window !== "undefined" && import.meta.env?.DEV) {
  (window as unknown as Record<string, unknown>)["cacheInspector"] = CacheInspector;
  console.log("🔧 Cache Inspector disponible como window.cacheInspector");
}
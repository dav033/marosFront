

import { globalCache, apiCache } from "src/lib/cacheManager";

export const CacheInspector = {
  inspectGlobalCache() {
    console.log("🔍 GLOBAL CACHE INSPECTION");
    console.log("=========================");

    if (typeof window === "undefined") {
      console.log("❌ No disponible en servidor");
      return;
    }

    const stats = globalCache.getStats();
    console.log("📊 Estadísticas:", stats);

    const cacheKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith("cache_")
    );
    console.log(`📦 Elementos en sessionStorage: ${cacheKeys.length}`);

    cacheKeys.forEach((key) => {
      try {
        const actualKey = key.replace("cache_", "");
        const data = JSON.parse(sessionStorage.getItem(key) || "{}");
        const isExpired = Date.now() - data.timestamp > data.ttl;

        console.log(`\n🔑 Key: ${actualKey}`);
        console.log(
          `⏰ Timestamp: ${new Date(data.timestamp).toLocaleString()}`
        );
        console.log(`⏳ TTL: ${data.ttl / 1000}s`);
        console.log(`${isExpired ? "❌ EXPIRED" : "✅ VALID"}`);
        console.log(
          `📄 Data preview:`,
          data.data?.length ? `${data.data.length} items` : data.data
        );
      } catch (error) {
        console.warn(`⚠️ Error parsing ${key}:`, error);
      }
    });
  },

  inspectApiCache() {
    console.log("\n🔍 API CACHE INSPECTION");
    console.log("======================");

    const stats = apiCache.getStats();
    console.log("📊 Estadísticas:", stats);
  },

  clearAllCache() {
    console.log("🧹 Limpiando todo el cache...");
    globalCache.clear();
    apiCache.clear();
    console.log("✅ Cache limpiado");
  },

  getCacheSize() {
    if (typeof window === "undefined") return 0;

    let totalSize = 0;
    const cacheKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith("cache_")
    );

    cacheKeys.forEach((key) => {
      const value = sessionStorage.getItem(key) || "";
      totalSize += new Blob([value]).size;
    });

    console.log(
      `💾 Tamaño total del cache: ${(totalSize / 1024).toFixed(2)} KB`
    );
    return totalSize;
  },

  watchCache() {
    console.log("👀 Iniciando monitoreo del cache...");

    const originalSet = globalCache.set.bind(globalCache);
    const originalGet = globalCache.get.bind(globalCache);

    globalCache.set = function (key: string, data: any, ttl?: number) {
      console.log(`📝 Cache SET: ${key}`, {
        dataLength: data?.length || "N/A",
        ttl,
      });
      return originalSet(key, data, ttl);
    };

    globalCache.get = function (key: string) {
      const result = originalGet(key);
      console.log(`📖 Cache GET: ${key}`, result ? "✅ HIT" : "❌ MISS");
      return result;
    };
  },
};

if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).cacheInspector = CacheInspector;
  console.log("🔧 Cache Inspector disponible como window.cacheInspector");
}

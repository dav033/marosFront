

import { globalCache, apiCache } from "src/lib/cacheManager";
import { logger } from "./logger";

export const CacheInspector = {
  inspectGlobalCache() {
  logger.info("🔍 GLOBAL CACHE INSPECTION");
  logger.info("=========================");

    if (typeof window === "undefined") {
  logger.warn("❌ No disponible en servidor");
      return;
    }

    const stats = globalCache.getStats();
  logger.info("📊 Estadísticas:", stats);

    const cacheKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith("cache_")
    );
  logger.info(`📦 Elementos en sessionStorage: ${cacheKeys.length}`);

    cacheKeys.forEach((key) => {
      try {
        const actualKey = key.replace("cache_", "");
        const data = JSON.parse(sessionStorage.getItem(key) || "{}");
        const isExpired = Date.now() - data.timestamp > data.ttl;

  logger.debug(`\n🔑 Key: ${actualKey}`);
  logger.debug(`⏰ Timestamp: ${new Date(data.timestamp).toLocaleString()}`);
  logger.debug(`⏳ TTL: ${data.ttl / 1000}s`);
  logger.debug(`${isExpired ? "❌ EXPIRED" : "✅ VALID"}`);
  logger.debug(`📄 Data preview:`, data.data?.length ? `${data.data.length} items` : data.data);
      } catch (error) {
  logger.warn(`⚠️ Error parsing ${key}:`, error);
      }
    });
  },

  inspectApiCache() {
  logger.info("\n🔍 API CACHE INSPECTION");
  logger.info("======================");

    const stats = apiCache.getStats();
  logger.info("📊 Estadísticas:", stats);
  },

  clearAllCache() {
  logger.info("🧹 Limpiando todo el cache...");
    globalCache.clear();
    apiCache.clear();
  logger.info("✅ Cache limpiado");
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

  logger.info(`💾 Tamaño total del cache: ${(totalSize / 1024).toFixed(2)} KB`);
    return totalSize;
  },

  watchCache() {
  logger.info("👀 Iniciando monitoreo del cache...");

    const originalSet = globalCache.set.bind(globalCache);
    const originalGet = globalCache.get.bind(globalCache);

    globalCache.set = function (key: string, data: any, ttl?: number) {
      logger.debug(`📝 Cache SET: ${key}`, {
        dataLength: data?.length || "N/A",
        ttl,
      });
      return originalSet(key, data, ttl);
    };

    globalCache.get = function (key: string) {
      const result = originalGet(key);
  logger.debug(`📖 Cache GET: ${key}`, result ? "✅ HIT" : "❌ MISS");
      return result;
    };
  },
};

if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).cacheInspector = CacheInspector;
  logger.info("🔧 Cache Inspector disponible como window.cacheInspector");
}

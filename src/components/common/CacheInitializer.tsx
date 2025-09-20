// src/components/common/CacheInitializer.tsx
/**
 * Componente de inicialización del sistema de cache (presentación)
 * - Sin dependencias a OptimizedLeadsService
 * - Opcional: autoprefetch de leads via optimizedApiClient
 */

import React, { useEffect, useState } from "react";
import CacheDiagnostics from "./CacheDiagnostics";
import {
  useCacheDiagnostics,
  usePerformanceMonitor,
  useCacheLogging,
} from "../../hooks/useCacheDiagnostics";
import { optimizedApiClient } from "../../lib/optimizedApiClient";
import { globalCache, apiCache } from "../../lib/cacheManager";
import { prefetchManager } from "../../lib/prefetchManager";

import type { CacheInitializerProps } from "../../types/components/common";
import { LeadType } from "@/features/leads/enums";
import type { CacheMetrics } from "./cache";

// Autoprefetch mínimo, sin tocar capa de dominio
function setupAutoPrefetchLeads() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  const type =
    path.includes("plumbing") ? LeadType.PLUMBING : LeadType.CONSTRUCTION;

  // Prefetch lista de leads por tipo usando la capa HTTP con caché
  optimizedApiClient
    .get(`/leads/type?type=${type}`, {
      cache: { enabled: true, strategy: "cache-first", ttl: 15 * 60 * 1000 },
    })
    .catch(() => {
      // No interrumpir la UI si falla el prefetch
    });
}

export const CacheInitializer: React.FC<CacheInitializerProps> = ({
  enabled = true,
  debug = false,
  autoPreload = true,
}) => {
  const [initialized, setInitialized] = useState(false);
  const [stats, setStats] = useState<CacheMetrics | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const { isOpen, close } = useCacheDiagnostics({
    enabled: debug && isClient,
    hotkey: "F12",
    autoShow: false,
  });

  usePerformanceMonitor(debug && isClient);
  useCacheLogging(debug && isClient);

  useEffect(() => {
    if (!enabled || initialized || !isClient) return;

    let preloadTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let cleanupIntervalId: ReturnType<typeof setInterval> | undefined;
    let statsIntervalId: ReturnType<typeof setInterval> | undefined;

    const initializeCache = async () => {
      try {
        // 1) Autoprefetch leads (reemplazo al antiguo service)
        setupAutoPrefetchLeads();

        // 2) Precarga de catálogos críticos (contacts / project-types)
        if (autoPreload) {
          preloadTimeoutId = setTimeout(async () => {
            try {
              await Promise.allSettled([
                optimizedApiClient.get("/contacts/all", {
                  cache: {
                    enabled: true,
                    strategy: "cache-first",
                    ttl: 300000,
                  },
                }),
                optimizedApiClient
                  .get("/project-types/all", {
                    cache: {
                      enabled: true,
                      strategy: "cache-first",
                      ttl: 600000,
                    },
                  })
                  .catch(() => {
                    console.log(
                      "ℹ️ Project types endpoint not available, skipping..."
                    );
                  }),
              ]);
            } catch (err) {
              console.warn("⚠️ Error precargando datos:", err);
            }
          }, 1000);
        }

        // 3) Limpieza periódica y mantenimiento
        cleanupIntervalId = setInterval(() => {
          const apiStats = apiCache.getStats();
          const globalStats = globalCache.getStats();
          if (apiStats.expired > 10) console.log("🧹 Limpiando cache API...");
          if (globalStats.expired > 20) console.log("🧹 Limpiando cache global...");
          prefetchManager.cleanup();
        }, 15 * 60 * 1000);

        // 4) Métricas (opcional debug)
        if (debug) {
          statsIntervalId = setInterval(() => {
            // Construye el objeto EXACTO esperado por CacheMetrics.
            const newStats: CacheMetrics = {
              globalCache: { ...globalCache.getStats() },
              apiCache: { ...apiCache.getStats() },
              prefetch: { ...prefetchManager.getStats() },
              // Si quieres, puedes añadir "client" más adelante (es opcional en el tipo).
            };
            setStats(newStats);
          }, 10000);
        }

        setInitialized(true);
      } catch (error) {
        console.error("❌ Error inicializando cache:", error);
      }
    };

    initializeCache();

    return () => {
      if (preloadTimeoutId) clearTimeout(preloadTimeoutId);
      if (cleanupIntervalId) clearInterval(cleanupIntervalId);
      if (statsIntervalId) clearInterval(statsIntervalId);
    };
  }, [enabled, initialized, debug, autoPreload, isClient]);

  useEffect(() => {
    if (!debug || !initialized) return;
    const handleCacheEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log(`🗄️ Cache Event: ${event.type}`, customEvent.detail);
    };
    window.addEventListener("cache:hit", handleCacheEvent);
    window.addEventListener("cache:miss", handleCacheEvent);
    window.addEventListener("cache:set", handleCacheEvent);
    return () => {
      window.removeEventListener("cache:hit", handleCacheEvent);
      window.removeEventListener("cache:miss", handleCacheEvent);
      window.removeEventListener("cache:set", handleCacheEvent);
    };
  }, [debug, initialized]);

  if (!enabled) return null;

  return (
    <>
      {debug && initialized && (
        <div
          className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs z-50 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => console.log("📊 Current Cache Stats:", stats)}
          title="Cache System Active - Click for stats"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              console.log("📊 Current Cache Stats:", stats);
            }
          }}
        >
          🗄️ Cache Ready
        </div>
      )}

      {debug && <CacheDiagnostics isOpen={isOpen} onClose={close} />}
    </>
  );
};

export default CacheInitializer;

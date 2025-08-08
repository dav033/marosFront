/**
 * Componente de inicialización del sistema de cache
 * Se ejecuta una vez al cargar la aplicación
 */

import React, { useEffect, useState } from 'react';
import CacheDiagnostics from './CacheDiagnostics';
import { useCacheDiagnostics, usePerformanceMonitor, useCacheLogging } from '../../hooks/useCacheDiagnostics';
import { OptimizedLeadsService } from '../../services/OptimizedLeadsService';
import { optimizedApiClient } from '../../lib/optimizedApiClient';
import { globalCache, apiCache } from '../../lib/cacheManager';
import { prefetchManager } from '../../lib/prefetchManager';

interface CacheInitializerProps {
  enabled?: boolean;
  debug?: boolean;
  autoPreload?: boolean;
}

export const CacheInitializer: React.FC<CacheInitializerProps> = ({
  enabled = true,
  debug = false,
  autoPreload = true
}) => {
  const [initialized, setInitialized] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Verificar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Configurar diagnósticos solo en el cliente
  const { isOpen, close } = useCacheDiagnostics({
    enabled: debug && isClient,
    hotkey: 'F12',
    autoShow: false
  });

  // Activar monitoring en desarrollo solo en el cliente
  usePerformanceMonitor(debug && isClient);
  useCacheLogging(debug && isClient);

  useEffect(() => {
    if (!enabled || initialized || !isClient) return;

    const initializeCache = async () => {
      try {
        console.log('🚀 Inicializando sistema de cache...');

        // 1. Configurar prefetch automático
        OptimizedLeadsService.setupAutoPrefetch();

        // 2. Precargar datos críticos si está habilitado
        if (autoPreload) {
          console.log('📦 Precargando datos críticos...');
          
          // Precargar en background sin bloquear UI
          setTimeout(async () => {
            try {
              // Usar API client directamente en lugar de prefetch manager
              await Promise.allSettled([
                optimizedApiClient.get('/contacts/all', {
                  cache: { enabled: true, strategy: 'cache-first', ttl: 300000 }
                }),
                optimizedApiClient.get('/project-types/all', {
                  cache: { enabled: true, strategy: 'cache-first', ttl: 600000 }
                }).catch(() => {
                  console.log('ℹ️ Project types endpoint not available, skipping...');
                })
              ]);
              console.log('✅ Datos críticos precargados');
            } catch (error) {
              console.warn('⚠️ Error precargando datos:', error);
            }
          }, 1000);
        }

        // 3. Configurar limpieza automática
        setInterval(() => {
          const apiStats = apiCache.getStats();
          const globalStats = globalCache.getStats();
          
          // Limpiar si hay muchas entradas expiradas
          if (apiStats.expired > 10) {
            console.log('🧹 Limpiando cache API...');
          }
          if (globalStats.expired > 20) {
            console.log('🧹 Limpiando cache global...');
          }

          // Limpiar tareas de prefetch completadas
          prefetchManager.cleanup();
        }, 15 * 60 * 1000); // Cada 15 minutos

        // 4. Monitorear performance
        if (debug) {
          setInterval(() => {
            const newStats = {
              api: apiCache.getStats(),
              global: globalCache.getStats(),
              prefetch: prefetchManager.getStats(),
              timestamp: new Date().toLocaleTimeString()
            };
            setStats(newStats);
          }, 10000); // Cada 10 segundos
        }

        setInitialized(true);
        console.log('✅ Sistema de cache inicializado correctamente');

        // Mostrar stats iniciales en modo debug
        if (debug) {
          console.log('📊 Cache Stats:', {
            api: apiCache.getStats(),
            global: globalCache.getStats(),
            prefetch: prefetchManager.getStats()
          });
        }

      } catch (error) {
        console.error('❌ Error inicializando cache:', error);
      }
    };

    initializeCache();
  }, [enabled, initialized, debug, autoPreload]);

  // Configurar event listeners para cache events
  useEffect(() => {
    if (!debug || !initialized) return;

    const handleCacheEvent = (event: CustomEvent) => {
      console.log(`🗄️ Cache Event: ${event.type}`, event.detail);
    };

    // Escuchar eventos de cache si los implementamos
    window.addEventListener('cache:hit' as any, handleCacheEvent);
    window.addEventListener('cache:miss' as any, handleCacheEvent);
    window.addEventListener('cache:set' as any, handleCacheEvent);

    return () => {
      window.removeEventListener('cache:hit' as any, handleCacheEvent);
      window.removeEventListener('cache:miss' as any, handleCacheEvent);
      window.removeEventListener('cache:set' as any, handleCacheEvent);
    };
  }, [debug, initialized]);

  // No renderizar nada visible, solo inicialización
  if (!enabled) return null;

  return (
    <>
      {/* Indicador de estado en modo debug */}
      {debug && initialized && (
        <div 
          className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs z-50 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => console.log('📊 Current Cache Stats:', stats)}
          title="Cache System Active - Click for stats"
        >
          🗄️ Cache Ready
        </div>
      )}

      {/* Diagnósticos */}
      {debug && (
        <CacheDiagnostics isOpen={isOpen} onClose={close} />
      )}
    </>
  );
};

export default CacheInitializer;

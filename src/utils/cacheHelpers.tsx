/**
 * Wrapper para migrar fácilmente componentes existentes al sistema de cache
 * Reemplaza el hook useFetch existente con comportamiento optimizado
 */

import React from 'react';
import type { UseFetchResult } from '../hooks/UseFetchResult';
import { useOptimizedFetch } from '../hooks/useOptimizedFetch';

/**
 * Función para wrapear el useFetch existente con cache
 */
export function withCache<T, P extends unknown[]>(
  originalUseFetch: (
    requestFn: (...args: P) => Promise<T>,
    params: P,
    deps?: unknown[]
  ) => UseFetchResult<T>
) {
  return function useCachedFetch(
    requestFn: (...args: P) => Promise<T>,
    params: P,
    deps?: unknown[],
    cacheOptions?: {
      cacheKey?: string;
      ttl?: number;
      showSkeletonOnlyOnFirstLoad?: boolean;
    }
  ): UseFetchResult<T> & { fromCache: boolean } {
    
    // Si no se proporcionan opciones de cache, usar el hook original
    if (!cacheOptions?.cacheKey) {
      const result = originalUseFetch(requestFn, params, deps);
      return { ...result, fromCache: false };
    }

    // Usar la versión optimizada con cache
    const {
      data,
      loading,
      error,
      refetch,
      fromCache
    } = useOptimizedFetch(
      requestFn,
      params,
      {
        cacheKey: cacheOptions.cacheKey,
        ttl: cacheOptions.ttl || 300000,
        showSkeletonOnlyOnFirstLoad: cacheOptions.showSkeletonOnlyOnFirstLoad ?? true
      },
      deps
    );

    return {
      data,
      loading,
      error,
      refetch,
      fromCache
    };
  };
}

/**
 * HOC para wrapear componentes existentes con cache automático
 */
export function withAutoCache<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  cacheConfig: {
    generateCacheKey: (props: P) => string;
    ttl?: number;
    showSkeletonOnlyOnFirstLoad?: boolean;
  }
) {
  return function CachedComponent(props: P) {
    const cacheKey = cacheConfig.generateCacheKey(props);
    
    return (
      <div data-cache-key={cacheKey}>
        <Component {...props} />
      </div>
    );
  };
}

/**
 * Hook de migración simple - reemplaza useFetch existente
 */
export function useMigratedFetch<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  params: P,
  deps?: unknown[]
): UseFetchResult<T> & { fromCache: boolean; migrateToCache: (cacheKey: string) => void } {
  
  const [cacheKey, setCacheKey] = React.useState<string | null>(null);
  
  // Función para activar cache manualmente
  const migrateToCache = React.useCallback((key: string) => {
    setCacheKey(key);
  }, []);

  // Si no hay cacheKey, comportamiento original (con skeleton siempre)
  if (!cacheKey) {
    const [data, setData] = React.useState<T | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const actualDeps = deps ?? params;

    const fetchData = React.useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await requestFn(...params);
        setData(result);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }, [requestFn, ...actualDeps]);

    React.useEffect(() => {
      fetchData();
    }, [fetchData]);

    return {
      data,
      loading,
      error,
      refetch: fetchData,
      fromCache: false,
      migrateToCache
    };
  }

  // Si hay cacheKey, usar comportamiento optimizado
  const optimizedResult = useOptimizedFetch(
    requestFn,
    params,
    {
      cacheKey,
      ttl: 300000,
      showSkeletonOnlyOnFirstLoad: true
    },
    deps
  );

  return {
    data: optimizedResult.data,
    loading: optimizedResult.loading,
    error: optimizedResult.error,
    refetch: optimizedResult.refetch,
    fromCache: optimizedResult.fromCache,
    migrateToCache
  };
}

/**
 * Componente para mostrar indicadores de cache
 */
export const CacheIndicator: React.FC<{
  fromCache: boolean;
  loading: boolean;
  cacheAge?: number;
  className?: string;
}> = ({ fromCache, loading, cacheAge, className = "" }) => {
  if (!fromCache && !loading) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {fromCache && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          📦 Cache
          {cacheAge && cacheAge > 0 && (
            <span className="ml-1 opacity-75">
              {Math.round(cacheAge / 1000)}s
            </span>
          )}
        </span>
      )}
      
      {loading && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {fromCache ? '🔄 Refreshing...' : '⏳ Loading...'}
        </span>
      )}
    </div>
  );
};

/**
 * Componente condicional de skeleton - solo muestra si no hay cache
 */
export const SmartSkeleton: React.FC<{
  show: boolean;
  fromCache: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ show, fromCache, children, fallback }) => {
  // Si hay datos del cache, mostrar children inmediatamente
  if (fromCache) {
    return <>{children}</>;
  }

  // Si estamos cargando y no hay cache, mostrar skeleton
  if (show) {
    return <>{fallback || <DefaultSkeleton />}</>;
  }

  // Si no estamos cargando, mostrar children
  return <>{children}</>;
};

const DefaultSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="bg-gray-300 h-4 rounded"></div>
        <div className="bg-gray-300 h-3 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

export default {
  withCache,
  withAutoCache,
  useMigratedFetch,
  CacheIndicator,
  SmartSkeleton
};

/**
 * Hook optimizado para datos instantáneos
 * Elimina skeletons cuando hay datos en cache
 */

import { useState, useEffect, useCallback } from 'react';
import { globalCache, apiCache } from '../lib/cacheManager';
import { optimizedApiClient } from '../lib/optimizedApiClient';

export interface UseInstantDataConfig<T> {
  cacheKey: string;
  fetchFn: () => Promise<T>;
  initialValue?: T;
  ttl?: number;
  enableCache?: boolean;
  strategy?: 'cache-first' | 'network-first' | 'cache-only';
  onCacheHit?: (data: T) => void;
  onCacheMiss?: () => void;
}

export interface UseInstantDataResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  fromCache: boolean;
  refresh: () => Promise<void>;
  clearCache: () => void;
}

/**
 * Hook para datos instantáneos - no muestra skeleton si hay cache
 */
export function useInstantData<T = any>(config: UseInstantDataConfig<T>): UseInstantDataResult<T> {
  const {
    cacheKey,
    fetchFn,
    initialValue,
    ttl = 300000, // 5 minutos
    enableCache = true,
    strategy = 'cache-first',
    onCacheHit,
    onCacheMiss
  } = config;

  // Detectar caché sincrónicamente para el primer render
  const initialCached = enableCache ? (apiCache.get(cacheKey) || globalCache.get(cacheKey)) : null;
  const [data, setData] = useState<T>((initialCached ?? (initialValue as T)));
  const [fromCache, setFromCache] = useState(Boolean(initialCached));
  const [loading, setLoading] = useState(!initialCached);
  const [error, setError] = useState<Error | null>(null);

  // Verificar cache inmediatamente al cargar
  const checkCache = useCallback((): T | null => {
    if (!enableCache) return null;

    const cached = apiCache.get(cacheKey) || globalCache.get(cacheKey);
    if (cached) {
      setFromCache(true);
      onCacheHit?.(cached as T);
      return cached as T;
    }
    
    setFromCache(false);
    onCacheMiss?.();
    return null;
  }, [cacheKey, enableCache, onCacheHit, onCacheMiss]);

  // Fetch de datos desde la red
  const fetchData = useCallback(async (forceNetwork = false): Promise<T | null> => {
    try {
      setError(null);
      
      // Si no es forzado y es cache-only, no hacer request
      if (!forceNetwork && strategy === 'cache-only') {
        return null;
      }

      setLoading(true);
      const result = await fetchFn();
      
      // Guardar en cache
      if (enableCache) {
        apiCache.set(cacheKey, result, ttl);
      }
      
      setFromCache(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setFromCache(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, enableCache, cacheKey, ttl, strategy]);

  // Lógica principal de carga
  const loadData = useCallback(async () => {
    const cached = checkCache();
    
    if (cached && strategy === 'cache-first') {
      // Cache-first: usar cache si existe
      setData(cached);
      return;
    }
    
    if (strategy === 'network-first' || !cached) {
      // Network-first o no hay cache: fetch de red
      const networkData = await fetchData();
      if (networkData) {
        setData(networkData);
      } else if (cached && strategy === 'network-first') {
        // Fallback a cache si falla la red
        setData(cached);
        setFromCache(true);
      }
    }
  }, [checkCache, strategy, fetchData]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    const networkData = await fetchData(true);
    if (networkData) {
      setData(networkData);
    }
  }, [fetchData]);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    apiCache.delete(cacheKey);
    globalCache.delete(cacheKey);
    setFromCache(false);
  }, [cacheKey]);

  // Efecto inicial
  useEffect(() => {
    // Verificar cache inmediatamente (síncrono)
    const cached = checkCache();
    
    if (cached) {
      setData(cached);
      setLoading(false); // No hay loading si viene de cache
      // Si es cache-first, no hacer loading
      if (strategy === 'cache-first') {
        return;
      }
    }

    // Si no hay cache o es network-first, cargar datos
    if (!cached || strategy === 'network-first') {
      loadData();
    }
  }, [cacheKey]); // Solo depender de cacheKey

  return {
    data,
    loading,
    error,
    fromCache,
    refresh,
    clearCache
  };
}

/**
 * Hook específico para listas que elimina skeleton en navegaciones repetidas
 */
export function useInstantList<T = any>(
  listKey: string,
  fetchFn: () => Promise<T[]>,
  options: {
    ttl?: number;
    prefetch?: boolean;
    showSkeletonOnlyOnFirstLoad?: boolean;
  } = {}
) {
  const { 
    ttl = 300000, 
    prefetch = true, 
    showSkeletonOnlyOnFirstLoad = true
  } = options;
  
  const result = useInstantData<T[]>({
    cacheKey: `list_${listKey}`,
    fetchFn,
    initialValue: [],
    ttl: ttl,
    strategy: 'cache-first',
    enableCache: true,
    onCacheHit: (data) => {
      console.log(`📦 List "${listKey}" loaded from cache (${data.length} items)`);
    },
    onCacheMiss: () => {
      console.log(`🌐 List "${listKey}" not in cache, fetching...`);
    }
  });

  // Determinar si mostrar skeleton
  const shouldShowSkeleton = showSkeletonOnlyOnFirstLoad 
    ? result.loading && !result.fromCache && result.data.length === 0
    : result.loading;

  return {
    ...result,
    isEmpty: result.data.length === 0,
    hasData: result.data.length > 0,
    showSkeleton: shouldShowSkeleton,
    items: result.data
  };
}

/**
 * Hook para formularios que persisten instantáneamente
 */
export function useInstantForm<T extends Record<string, any>>(
  formKey: string,
  initialValues: T,
  options: {
    autosave?: boolean;
    autosaveDelay?: number;
  } = {}
): {
  values: T;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  isDirty: boolean;
  fromCache: boolean;
} {
  const { autosave = true, autosaveDelay = 1000 } = options;
  
  const result = useInstantData<T>({
    cacheKey: `form_${formKey}`,
    fetchFn: async () => initialValues, // Fallback a valores iniciales
    initialValue: initialValues,
    ttl: 3600000, // 1 hora para formularios
    strategy: 'cache-first'
  });

  const [isDirty, setIsDirty] = useState(false);

  // Verificar si hay cambios
  useEffect(() => {
    const hasChanges = Object.keys(initialValues).some(
      key => result.data[key] !== initialValues[key]
    );
    setIsDirty(hasChanges);
  }, [result.data, initialValues]);

  const setValue = useCallback((field: keyof T, value: any) => {
    const newValues = { ...result.data, [field]: value };
    
    // Actualizar inmediatamente en cache
    apiCache.set(`form_${formKey}`, newValues, 3600000);
    
    // Actualizar estado local
    result.refresh();
  }, [result, formKey]);

  const setValues = useCallback((values: Partial<T>) => {
    const newValues = { ...result.data, ...values };
    
    // Actualizar inmediatamente en cache
    apiCache.set(`form_${formKey}`, newValues, 3600000);
    
    // Actualizar estado local
    result.refresh();
  }, [result, formKey]);

  const reset = useCallback(() => {
    apiCache.set(`form_${formKey}`, initialValues, 3600000);
    result.refresh();
    setIsDirty(false);
  }, [formKey, initialValues, result]);

  return {
    values: result.data,
    setValue,
    setValues,
    reset,
    isDirty,
    fromCache: result.fromCache
  };
}

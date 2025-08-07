/**
 * Hook personalizado para cache de estado entre navegaciones
 * Mantiene el estado de componentes y formularios durante la sesión
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { globalCache } from '../lib/cacheManager';

export interface StateCacheConfig {
  key: string;
  ttl?: number; // Time to live en milliseconds
  storage?: 'memory' | 'session' | 'local';
  initialValue?: any;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  deps?: unknown[]; // Dependencias que invalidan el cache
}

export interface StateCacheResult<T> {
  value: T;
  setValue: (newValue: T | ((prev: T) => T)) => void;
  cached: boolean;
  clear: () => void;
  refresh: () => void;
  loading: boolean;
}

/**
 * Hook para cachear estado entre navegaciones
 */
export function useStateCache<T = any>(config: StateCacheConfig): StateCacheResult<T> {
  const {
    key,
    ttl = 30 * 60 * 1000, // 30 minutos por defecto
    storage = 'session',
    initialValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    deps = []
  } = config;

  const [loading, setLoading] = useState(true);
  const [cached, setCached] = useState(false);
  const depsRef = useRef(deps);
  const prevDepsRef = useRef<unknown[]>([]);

  // Verificar si las dependencias han cambiado
  const depsChanged = useCallback(() => {
    return depsRef.current.some((dep, index) => dep !== prevDepsRef.current[index]);
  }, []);

  // Obtener valor inicial del cache
  const getInitialValue = useCallback((): T => {
    try {
      // Si las dependencias cambiaron, no usar cache
      if (depsChanged()) {
        globalCache.delete(key);
        return initialValue;
      }

      if (storage === 'memory') {
        const cached = globalCache.get(key);
        if (cached !== null) {
          setCached(true);
          return cached as T;
        }
      } else {
        const storageObj = storage === 'local' ? localStorage : sessionStorage;
        const cachedRaw = storageObj.getItem(`state_${key}`);
        
        if (cachedRaw) {
          const cached = deserialize(cachedRaw);
          setCached(true);
          // También guardarlo en memory cache para acceso rápido
          globalCache.set(key, cached, ttl);
          return cached as T;
        }
      }
    } catch (error) {
      console.warn(`Error loading cached state for ${key}:`, error);
    }
    
    setCached(false);
    return initialValue;
  }, [key, storage, initialValue, ttl, deserialize, depsChanged]);

  const [value, setValueState] = useState<T>(getInitialValue);

  // Actualizar referencias de dependencias
  useEffect(() => {
    prevDepsRef.current = [...depsRef.current];
    depsRef.current = deps;
  }, [deps]);

  // Cargar valor inicial
  useEffect(() => {
    setLoading(true);
    const initialVal = getInitialValue();
    setValueState(initialVal);
    setLoading(false);
  }, [getInitialValue]);

  // Función para actualizar el valor
  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValueState(prevValue => {
      const finalValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevValue)
        : newValue;

      // Guardar en cache
      try {
        // Memory cache
        globalCache.set(key, finalValue, ttl);

        // Storage persistente
        if (storage !== 'memory') {
          const storageObj = storage === 'local' ? localStorage : sessionStorage;
          storageObj.setItem(`state_${key}`, serialize(finalValue));
        }

        setCached(true);
      } catch (error) {
        console.warn(`Error saving state cache for ${key}:`, error);
      }

      return finalValue;
    });
  }, [key, storage, ttl, serialize]);

  // Limpiar cache
  const clear = useCallback(() => {
    globalCache.delete(key);
    
    if (storage !== 'memory') {
      const storageObj = storage === 'local' ? localStorage : sessionStorage;
      storageObj.removeItem(`state_${key}`);
    }
    
    setValueState(initialValue);
    setCached(false);
  }, [key, storage, initialValue]);

  // Refrescar desde storage
  const refresh = useCallback(() => {
    const newValue = getInitialValue();
    setValueState(newValue);
  }, [getInitialValue]);

  return {
    value,
    setValue,
    cached,
    clear,
    refresh,
    loading
  };
}

/**
 * Hook para cachear formularios
 */
export function useFormCache<T extends Record<string, any>>(
  formKey: string,
  initialValues: T,
  options: Partial<StateCacheConfig> = {}
): StateCacheResult<T> & {
  updateField: (field: keyof T, value: any) => void;
  resetForm: () => void;
  isDirty: boolean;
} {
  const cacheResult = useStateCache<T>({
    key: `form_${formKey}`,
    initialValue: initialValues,
    ttl: 60 * 60 * 1000, // 1 hora para formularios
    ...options
  });

  const [isDirty, setIsDirty] = useState(false);

  // Verificar si el formulario está sucio
  useEffect(() => {
    const isFormDirty = Object.keys(initialValues).some(
      key => cacheResult.value[key] !== initialValues[key]
    );
    setIsDirty(isFormDirty);
  }, [cacheResult.value, initialValues]);

  const updateField = useCallback((field: keyof T, value: any) => {
    cacheResult.setValue(prev => ({
      ...prev,
      [field]: value
    }));
  }, [cacheResult.setValue]);

  const resetForm = useCallback(() => {
    cacheResult.setValue(initialValues);
    setIsDirty(false);
  }, [cacheResult.setValue, initialValues]);

  return {
    ...cacheResult,
    updateField,
    resetForm,
    isDirty
  };
}

/**
 * Hook para cachear listas con paginación
 */
export function useListCache<T = any>(
  listKey: string,
  fetchFn: (page: number, size: number) => Promise<{ data: T[]; total: number }>,
  options: Partial<StateCacheConfig> & {
    pageSize?: number;
    prefetchPages?: number;
  } = {}
) {
  const { pageSize = 20, prefetchPages = 2, ...cacheOptions } = options;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const cacheResult = useStateCache<{
    pages: Record<number, { data: T[]; timestamp: number }>;
    total: number;
  }>({
    key: `list_${listKey}`,
    initialValue: { pages: {}, total: 0 },
    ttl: 15 * 60 * 1000, // 15 minutos para listas
    ...cacheOptions
  });

  const loadPage = useCallback(async (page: number, force = false) => {
    const existingPage = cacheResult.value.pages[page];
    const isStale = existingPage && (Date.now() - existingPage.timestamp > (cacheOptions.ttl || 15 * 60 * 1000));
    
    if (!force && existingPage && !isStale) {
      return existingPage.data;
    }

    setLoading(true);
    try {
      const result = await fetchFn(page, pageSize);
      
      cacheResult.setValue(prev => ({
        ...prev,
        pages: {
          ...prev.pages,
          [page]: {
            data: result.data,
            timestamp: Date.now()
          }
        },
        total: result.total
      }));

      // Prefetch páginas adyacentes
      for (let i = 1; i <= prefetchPages; i++) {
        const nextPage = page + i;
        const prevPage = page - i;
        
        if (nextPage <= Math.ceil(result.total / pageSize) && !cacheResult.value.pages[nextPage]) {
          setTimeout(() => loadPage(nextPage), i * 100);
        }
        
        if (prevPage > 0 && !cacheResult.value.pages[prevPage]) {
          setTimeout(() => loadPage(prevPage), i * 100);
        }
      }

      return result.data;
    } catch (error) {
      console.error(`Error loading page ${page} for ${listKey}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cacheResult, fetchFn, pageSize, prefetchPages, listKey, cacheOptions.ttl]);

  const getCurrentPageData = useCallback(() => {
    const pageData = cacheResult.value.pages[currentPage];
    return pageData ? pageData.data : [];
  }, [cacheResult.value.pages, currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    loadPage(page);
  }, [loadPage]);

  const refresh = useCallback(() => {
    loadPage(currentPage, true);
  }, [loadPage, currentPage]);

  const clearCache = useCallback(() => {
    cacheResult.clear();
    setCurrentPage(1);
  }, [cacheResult]);

  // Cargar página inicial
  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage, loadPage]);

  return {
    data: getCurrentPageData(),
    currentPage,
    totalPages: Math.ceil(cacheResult.value.total / pageSize),
    total: cacheResult.value.total,
    loading,
    cached: cacheResult.cached,
    goToPage,
    refresh,
    clearCache,
    hasNextPage: currentPage < Math.ceil(cacheResult.value.total / pageSize),
    hasPrevPage: currentPage > 1
  };
}
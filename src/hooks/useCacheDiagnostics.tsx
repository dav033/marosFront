/**
 * Hook para manejar los diagnósticos de cache
 * Incluye atajos de teclado y modo debug
 */

import { useState, useEffect, useCallback } from 'react';

export interface CacheDebugConfig {
  enabled: boolean;
  hotkey: string; // Tecla para abrir diagnostics (ej: 'F12', 'Ctrl+Shift+D')
  autoShow: boolean; // Mostrar automáticamente en development
  showInProduction: boolean;
}

export function useCacheDiagnostics(config: Partial<CacheDebugConfig> = {}) {
  const {
    enabled = true,
    hotkey = 'F12',
    autoShow = false,
    showInProduction = false
  } = config;

  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    const isDev = process.env.NODE_ENV === 'development';
    return enabled && (isDev || showInProduction);
  });

  const toggle = useCallback(() => {
    if (isEnabled) {
      setIsOpen(prev => !prev);
    }
  }, [isEnabled]);

  const open = useCallback(() => {
    if (isEnabled) {
      setIsOpen(true);
    }
  }, [isEnabled]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Manejo de hotkeys
  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      const ctrl = event.ctrlKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      let shouldTrigger = false;

      switch (hotkey.toLowerCase()) {
        case 'f12':
          shouldTrigger = key === 'F12';
          break;
        case 'ctrl+shift+d':
          shouldTrigger = ctrl && shift && key.toLowerCase() === 'd';
          break;
        case 'ctrl+shift+c':
          shouldTrigger = ctrl && shift && key.toLowerCase() === 'c';
          break;
        case 'alt+d':
          shouldTrigger = alt && key.toLowerCase() === 'd';
          break;
        default:
          shouldTrigger = key === hotkey;
      }

      if (shouldTrigger) {
        event.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [hotkey, toggle, isEnabled]);

  // Auto-show en development
  useEffect(() => {
    if (autoShow && isEnabled && process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // Mostrar después de 2 segundos

      return () => clearTimeout(timer);
    }
  }, [autoShow, isEnabled]);

  // URL parameter para debugging
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === 'cache' || params.get('cache-debug') === 'true') {
      setIsEnabled(true);
      setIsOpen(true);
    }
  }, []);

  return {
    isOpen,
    isEnabled,
    open,
    close,
    toggle,
    setEnabled: setIsEnabled
  };
}

/**
 * Hook para performance monitoring en desarrollo
 */
export function usePerformanceMonitor(enabled = process.env.NODE_ENV === 'development') {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Monitor de performance web vitals
    const observePerformance = () => {
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`🎨 LCP: ${entry.startTime.toFixed(2)}ms`);
          }
          if (entry.entryType === 'first-input') {
            console.log(`⚡ FID: ${(entry as any).processingStart - entry.startTime}ms`);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }

      return () => observer.disconnect();
    };

    // Monitor de memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log(`🧠 Memory: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB used`);
      }
    };

    // Monitor de navigation timing
    const monitorNavigation = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        console.log(`📊 Page Load: ${loadTime.toFixed(2)}ms`);
      }
    };

    const cleanup = observePerformance();
    
    // Monitor periódico
    const memoryInterval = setInterval(monitorMemory, 30000); // Cada 30 segundos
    
    // Monitor inicial
    setTimeout(monitorNavigation, 1000);

    return () => {
      cleanup?.();
      clearInterval(memoryInterval);
    };
  }, [enabled]);
}

/**
 * Hook para logging de cache events
 */
export function useCacheLogging(enabled = process.env.NODE_ENV === 'development') {
  useEffect(() => {
    if (!enabled) return;

    // Interceptar console logs relacionados con cache
    const originalLog = console.log;
    const originalWarn = console.warn;

    console.log = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('cache'))) {
        originalLog('🗄️', ...args);
      } else {
        originalLog(...args);
      }
    };

    console.warn = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('cache'))) {
        originalWarn('⚠️ 🗄️', ...args);
      } else {
        originalWarn(...args);
      }
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
    };
  }, [enabled]);
}

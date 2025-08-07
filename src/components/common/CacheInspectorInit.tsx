/**
 * Inicializador del inspector de cache
 */

import { useEffect } from 'react';
import { CacheInspector } from 'src/utils/cacheInspector';

interface CacheInspectorInitProps {
  enabled?: boolean;
}

export default function CacheInspectorInit({ enabled = true }: CacheInspectorInitProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    // Hacer disponible el inspector globalmente
    (window as any).cacheInspector = CacheInspector;
    
    // Log inicial
    console.log('🔧 Cache Inspector inicializado');
    console.log('Usa cacheInspector.inspectGlobalCache() para ver el contenido');
    
  }, [enabled]);

  return null; // Este componente no renderiza nada
}

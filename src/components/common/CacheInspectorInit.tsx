/**
 * Inicializador del inspector de cache
 */

import { useEffect } from "react";
import { CacheInspector } from "src/utils/cacheInspector";

import type { CacheInspectorInitProps } from "../../types/components/common";

export default function CacheInspectorInit({
  enabled = true,
}: CacheInspectorInitProps) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Hacer disponible el inspector globalmente
    (window as unknown as Record<string, unknown>)["cacheInspector"] =
      CacheInspector;

    // Log inicial
  }, [enabled]);

  return null; // Este componente no renderiza nada
}

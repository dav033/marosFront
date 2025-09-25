import { useEffect } from "react";

// Define claramente las props que esperas. Ajusta el tipo a tu caso real.
type CacheInitializerProps = {
  seed?: Record<string, unknown>;
  onReady?: () => void;
};

/**
 * Island 100% cliente:
 * - Export default obligatorio
 * - Nada de Node APIs
 * - Side-effects SOLO dentro de useEffect
 */
export default function CacheInitializer({ seed, onReady }: CacheInitializerProps) {
  useEffect(() => {
    // Garantiza entorno de navegador
    if (typeof window === "undefined") return;

    try {
      if (seed) {
        // ejemplo: persistir una semilla de caché
        window.localStorage.setItem("app:cache-seed", JSON.stringify(seed));
      }
      onReady?.();
    } catch {
      // silencioso para no romper la hidratación
    }
  }, [seed, onReady]);

  // No renderiza UI; solo inicializa cache/estado.
  return null;
}

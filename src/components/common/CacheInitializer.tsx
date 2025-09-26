import { useEffect } from "react";
type CacheInitializerProps = {
  seed?: Record<string, unknown>;
  onReady?: () => void;
};

export default function CacheInitializer({ seed, onReady }: CacheInitializerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (seed) {
        window.localStorage.setItem("app:cache-seed", JSON.stringify(seed));
      }
      onReady?.();
    } catch {
    }
  }, [seed, onReady]);
  return null;
}

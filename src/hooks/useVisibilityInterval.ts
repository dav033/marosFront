import { useEffect } from "react";
import type { UseVisibilityIntervalOptions } from "../types/hooks/visibility";

/** Programa ticks por intervalo y al recuperar visibilidad de la pestaña. */
export function useVisibilityInterval({ interval, enabled, tick }: UseVisibilityIntervalOptions) {
  useEffect(() => {
    if (!enabled || !interval) return;

    let active = true;
    const safeTick = () => { if (active) void tick(); };

    const id = setInterval(safeTick, interval);

    const onVis = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        safeTick();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVis);
    }

    return () => {
      active = false;
      clearInterval(id);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVis);
      }
    };
  }, [interval, enabled, tick]);
}

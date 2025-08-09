/**
 * Prefetch Manager (versión funcional)
 * - SSR-safe
 * - Eventos reales de hover/intersection
 * - Cola con prioridad y concurrencia
 */

import type { PrefetchManager, PrefetchTask, PrefetchConfig, PrefetchStats } from "@/types";
import { globalCache, apiCache } from "./cacheManager";



const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

function priorityNumber(level: "low" | "medium" | "high"): number {
  return level === "high" ? 10 : level === "medium" ? 5 : 1;
}

function scheduleIdleLoop(process: () => void) {
  if (!isBrowser) return;
  const anyWin = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
  const tick = () => {
    if (anyWin.requestIdleCallback) {
      anyWin.requestIdleCallback(() => {
        process();
        tick();
      });
    } else {
      setTimeout(() => {
        process();
        tick();
      }, 250);
    }
  };
  tick();
}

export function createPrefetchManager(opts: { maxConcurrent?: number } = {}): PrefetchManager {
  // Estado interno (closures)
  const tasks = new Map<string, PrefetchTask>();
  const queue: PrefetchTask[] = [];
  const running = new Set<string>();
  const maxConcurrent = opts.maxConcurrent ?? 3;

  // IntersectionObserver opcional
  const io =
    isBrowser && "IntersectionObserver" in window
      ? new IntersectionObserver(handleIntersection, { threshold: 0.1 })
      : undefined;

  // Bucle de idle para bombear la cola sin bloquear
  scheduleIdleLoop(processQueue);

  // --- API pública ---

  function register(
    key: string,
    fetchFn: () => Promise<unknown>,
    config: Partial<PrefetchConfig> = {}
  ): string {
    const id = `prefetch_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const task: PrefetchTask = {
      id,
      key,
      fetchFn,
      config: {
        enabled: true,
        priority: "medium",
        conditions: [{ type: "idle" }],
        delay: 120,
        ...config,
      },
      status: "pending",
      priority: priorityNumber(config.priority || "medium"),
      createdAt: Date.now(),
    };

    tasks.set(id, task);
    evaluateAndSchedule(task);
    return id;
  }

  async function execute(key: string): Promise<unknown> {
    const cached = globalCache.get?.(key) ?? apiCache.get?.(key);
    if (cached) return cached;

    const task = [...tasks.values()].find((t) => t.key === key);
    if (!task) return null;

    // Ejecuta de inmediato al margen de la cola
    return executeTask(task);
  }

  function cancel(id: string): boolean {
    const t = tasks.get(id);
    if (!t || t.status === "running") return false;
    tasks.delete(id);
    const idx = queue.findIndex((q) => q.id === id);
    if (idx >= 0) queue.splice(idx, 1);
    return true;
  }

  function onHover(element: Element, key: string, fetchFn: () => Promise<unknown>) {
    if (!isBrowser) return;
    const handler = () => {
      register(key, fetchFn, {
        priority: "high",
        conditions: [{ type: "hover", trigger: element }],
        delay: 0,
      });
      // Ejecutar inmediatamente tras el hover
      void execute(key);
      element.removeEventListener("mouseenter", handler);
    };
    element.addEventListener("mouseenter", handler, { once: true });
  }

  function onIntersection(element: Element, key: string, fetchFn: () => Promise<unknown>) {
    if (!io || !isBrowser) return;
    (element as HTMLElement).dataset.prefetchKey = key;
    register(key, fetchFn, {
      priority: "medium",
      conditions: [{ type: "intersection", trigger: element }],
      delay: 0, // la ejecución real la dispara el observer
    });
    io.observe(element);
  }

  function onRoutePredict(
    currentRoute: string,
    predictedRoutes: string[],
    fetchData: Record<string, () => Promise<unknown>>
  ) {
    const patterns: Record<string, string[]> = {
      "/leads": ["/leads/construction", "/leads/design"],
      "/contacts": ["/contacts/new", "/leads/new-contact"],
      "/dashboard": ["/leads", "/contacts", "/projects"],
    };
    const predicted = (patterns[currentRoute] || []).map((route) => ({
      route,
      probability: predictedRoutes.includes(route) ? 0.8 : 0.3,
    }));

    for (const { route, probability } of predicted) {
      if (probability > 0.3 && fetchData[route]) {
        const key = `route_${route}`;
        register(key, fetchData[route], {
          priority: probability > 0.7 ? "high" : "medium",
          conditions: [{ type: "route" }],
          delay: 600,
        });
      }
    }
  }

  function getStats(): PrefetchStats {
    const all = [...tasks.values()];
    return {
      total: all.length,
      pending: all.filter((t) => t.status === "pending").length,
      runningTasks: all.filter((t) => t.status === "running").length,
      completed: all.filter((t) => t.status === "completed").length,
      failed: all.filter((t) => t.status === "failed").length,
      queueSize: queue.length,
      activeConnections: running.size,
    };
  }

  function cleanup(): void {
    const cutoff = Date.now() - 30 * 60 * 1000; // 30 minutos
    for (const [id, t] of tasks.entries()) {
      if (t.status === "completed" && t.createdAt < cutoff) tasks.delete(id);
    }
  }

  // --- Internos ---

  function evaluateAndSchedule(task: PrefetchTask) {
    if (!task.config.enabled) return;

    // Si depende de evento (hover/intersection), no lo autoencolamos:
    const eventCondition = task.config.conditions.some((c) => c.type === "hover" || c.type === "intersection");
    if (eventCondition) return;

    setTimeout(() => {
      enqueueIfNotCached(task);
    }, task.config.delay);
  }

  function enqueueIfNotCached(task: PrefetchTask) {
    const cached = globalCache.get?.(task.key) ?? apiCache.get?.(task.key);
    if (cached) {
      task.status = "completed";
      return;
    }
    queue.push(task);
    queue.sort((a, b) => b.priority - a.priority);
    void processQueue();
  }

  async function processQueue(): Promise<void> {
    if (running.size >= maxConcurrent) return;
    const next = queue.shift();
    if (!next) return;

    running.add(next.id);
    next.status = "running";

    try {
      await executeTask(next);
      next.status = "completed";
    } catch (e) {
      console.warn(`Prefetch failed for ${next.key}`, e);
      next.status = "failed";
    } finally {
      running.delete(next.id);
      if (queue.length) void processQueue();
    }
  }

  async function executeTask(task: PrefetchTask): Promise<unknown> {
    const data = await task.fetchFn();
    if (task.key.startsWith("api_")) apiCache.set?.(task.key, data);
    else globalCache.set?.(task.key, data);
    return data;
  }

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      const key = el.dataset.prefetchKey;
      if (key) {
        void execute(key);
        io?.unobserve(el);
      }
    }
  }

  // Objeto con la API pública
  return {
    register,
    execute,
    cancel,
    onHover,
    onIntersection,
    onRoutePredict,
    getStats,
    cleanup,
  };
}

// Instancia global (igual firma que antes)
export const prefetchManager: PrefetchManager = createPrefetchManager();

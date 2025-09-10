// src/types/system/prefetch.ts

export type PrefetchPriority = "low" | "medium" | "high";
export type PrefetchTrigger = "hover" | "intersection" | "manual" | "idle";

export interface PrefetchCondition {
  type: "hover" | "intersection" | "manual";
  element?: string;
  threshold?: number;
  delay?: number;
}

export interface PrefetchConfig {
  enabled?: boolean;
  priority?: PrefetchPriority;
  conditions?: PrefetchCondition[];
  delay?: number;
  cacheKey?: string;
  endpoint?: string;
  ttl?: number;
  staleWhileRevalidate?: boolean;
  retry?: {
    attempts: number;
    delay: number;
  };
}

export interface PrefetchTask {
  id: string;
  key: string;
  fetchFn: () => Promise<unknown>;
  config: PrefetchConfig;
  status: "pending" | "running" | "completed" | "failed";
  priority: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  data?: unknown;
}

export interface PrefetchStats {
  total: number;
  pending: number;
  runningTasks: number;
  completed: number;
  failed: number;
  queueSize: number;
  activeConnections: number;
}

export interface PrefetchManager {
  register(key: string, fetchFn: () => Promise<unknown>, config?: Partial<PrefetchConfig>): string;
  execute(key: string): Promise<unknown>;
  cancel(id: string): boolean;
  onHover(element: HTMLElement, key: string): () => void;
  onIntersection(element: HTMLElement, key: string): void;
  onRoutePredict(routes: string[]): void;
  getStats(): PrefetchStats;
  cleanup(): void;
}

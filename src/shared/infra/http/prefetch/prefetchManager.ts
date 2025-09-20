// src/shared/infra/http/prefetch/prefetchManager.ts
type TaskFn = () => Promise<unknown>;

type Task = {
  id: string;
  key: string;
  fn: TaskFn;
  priority: "low" | "medium" | "high";
  enabled: boolean;
  status: "queued" | "running" | "completed" | "failed";
};

class PrefetchManager {
  private tasks = new Map<string, Task>();
  private stats = { total: 0, queued: 0, running: 0, completed: 0, failed: 0 };

  register(
    key: string,
    fn: TaskFn,
    opts?: { priority?: "low" | "medium" | "high"; enabled?: boolean }
  ): string {
    const id = `${key}:${Date.now()}`;
    const task: Task = {
      id,
      key,
      fn,
      priority: opts?.priority ?? "medium",
      enabled: opts?.enabled !== false,
      status: "queued",
    };
    this.tasks.set(key, task);
    this.recomputeStats();
    return id;
  }

  async execute(key: string): Promise<void> {
    const task = this.tasks.get(key);
    if (!task || !task.enabled) return;

    task.status = "running";
    this.recomputeStats();
    try {
      await task.fn();
      task.status = "completed";
      this.recomputeStats();
    } catch {
      task.status = "failed";
      this.recomputeStats();
      throw new Error(`Prefetch failed for ${key}`);
    }
  }

  getStats() {
    return { ...this.stats };
  }

  private recomputeStats() {
    const all = [...this.tasks.values()];
    this.stats.total = all.length;
    this.stats.queued = all.filter((t) => t.status === "queued").length;
    this.stats.running = all.filter((t) => t.status === "running").length;
    this.stats.completed = all.filter((t) => t.status === "completed").length;
    this.stats.failed = all.filter((t) => t.status === "failed").length;
  }
}

export const prefetchManager = new PrefetchManager();

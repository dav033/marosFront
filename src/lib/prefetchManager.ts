/**
 * Sistema de Prefetch inteligente
 * Predice y precarga datos que el usuario probablemente necesitará
 */

import { globalCache, apiCache } from './cacheManager';

export interface PrefetchConfig {
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  conditions: PrefetchCondition[];
  delay: number; // Delay antes de ejecutar prefetch en ms
}

export interface PrefetchCondition {
  type: 'route' | 'hover' | 'scroll' | 'idle' | 'intersection';
  trigger?: string | Element;
  threshold?: number;
}

export interface PrefetchTask {
  id: string;
  key: string;
  fetchFn: () => Promise<any>;
  config: PrefetchConfig;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  createdAt: number;
}

export class PrefetchManager {
  private tasks = new Map<string, PrefetchTask>();
  private queue: PrefetchTask[] = [];
  private running = new Set<string>();
  private maxConcurrent = 3;
  private idleTimeout: number | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor() {
    this.setupIdleCallback();
    this.setupIntersectionObserver();
  }

  /**
   * Registrar una tarea de prefetch
   */
  register(
    key: string,
    fetchFn: () => Promise<any>,
    config: Partial<PrefetchConfig> = {}
  ): string {
    const id = `prefetch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const task: PrefetchTask = {
      id,
      key,
      fetchFn,
      config: {
        enabled: true,
        priority: 'medium',
        conditions: [{ type: 'idle' }],
        delay: 100,
        ...config
      },
      status: 'pending',
      priority: this.calculatePriority(config.priority || 'medium'),
      createdAt: Date.now()
    };

    this.tasks.set(id, task);
    this.evaluateTask(task);
    
    return id;
  }

  /**
   * Prefetch basado en hover
   */
  onHover(element: Element, key: string, fetchFn: () => Promise<any>): void {
    const handleMouseEnter = () => {
      this.register(key, fetchFn, {
        priority: 'high',
        conditions: [{ type: 'hover', trigger: element }],
        delay: 50
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter, { once: true });
  }

  /**
   * Prefetch basado en intersección (elemento visible)
   */
  onIntersection(element: Element, key: string, fetchFn: () => Promise<any>): void {
    if (!this.intersectionObserver) return;

    const callback = () => {
      this.register(key, fetchFn, {
        priority: 'medium',
        conditions: [{ type: 'intersection', trigger: element }],
        delay: 200
      });
    };

    element.setAttribute('data-prefetch-key', key);
    element.setAttribute('data-prefetch-callback', callback.toString());
    this.intersectionObserver.observe(element);
  }

  /**
   * Prefetch basado en ruta
   */
  onRoutePredict(currentRoute: string, predictedRoutes: string[], fetchData: Record<string, () => Promise<any>>): void {
    const predictions = this.predictNextRoute(currentRoute, predictedRoutes);
    
    predictions.forEach(({ route, probability }) => {
      if (probability > 0.3 && fetchData[route]) {
        this.register(`route_${route}`, fetchData[route], {
          priority: probability > 0.7 ? 'high' : 'medium',
          conditions: [{ type: 'route' }],
          delay: 1000
        });
      }
    });
  }

  /**
   * Ejecutar prefetch manual
   */
  async execute(key: string): Promise<any> {
    // Verificar si ya está en cache
    const cached = globalCache.get(key) || apiCache.get(key);
    if (cached) {
      return cached;
    }

    // Buscar tarea por key en lugar de por id
    const task = Array.from(this.tasks.values()).find(t => t.key === key);
    if (!task) {
      // Si no hay tarea registrada, crear una temporal
      console.warn(`No prefetch task found for key: ${key}. Creating temporary task.`);
      return null;
    }

    return this.executeTask(task);
  }

  /**
   * Cancelar una tarea de prefetch
   */
  cancel(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task || task.status === 'running') {
      return false;
    }

    this.tasks.delete(id);
    this.queue = this.queue.filter(t => t.id !== id);
    return true;
  }

  /**
   * Obtener estadísticas de prefetch
   */
  getStats() {
    const tasks = Array.from(this.tasks.values());
    
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      runningTasks: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
      queueSize: this.queue.length,
      activeConnections: this.running.size
    };
  }

  /**
   * Limpiar tareas completadas
   */
  cleanup(): void {
    const cutoff = Date.now() - (30 * 60 * 1000); // 30 minutos
    
    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'completed' && task.createdAt < cutoff) {
        this.tasks.delete(id);
      }
    }
  }

  private evaluateTask(task: PrefetchTask): void {
    if (!task.config.enabled) return;

    const shouldExecute = task.config.conditions.every(condition => 
      this.evaluateCondition(condition, task)
    );

    if (shouldExecute) {
      this.scheduleTask(task);
    }
  }

  private evaluateCondition(condition: PrefetchCondition, task: PrefetchTask): boolean {
    switch (condition.type) {
      case 'idle':
        return this.isIdle();
      case 'route':
        return true; // Las rutas se evalúan externamente
      case 'hover':
      case 'intersection':
        return true; // Estos se manejan por eventos
      default:
        return true;
    }
  }

  private scheduleTask(task: PrefetchTask): void {
    setTimeout(() => {
      this.addToQueue(task);
    }, task.config.delay);
  }

  private addToQueue(task: PrefetchTask): void {
    // Verificar si ya está en cache
    const cached = globalCache.get(task.key) || apiCache.get(task.key);
    if (cached) {
      task.status = 'completed';
      return;
    }

    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.running.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.running.add(task.id);
    task.status = 'running';

    try {
      await this.executeTask(task);
      task.status = 'completed';
    } catch (error) {
      console.warn(`Prefetch failed for ${task.key}:`, error);
      task.status = 'failed';
    } finally {
      this.running.delete(task.id);
      // Continuar procesando la cola
      this.processQueue();
    }
  }

  private async executeTask(task: PrefetchTask): Promise<any> {
    try {
      const data = await task.fetchFn();
      
      // Guardar en cache apropiado
      if (task.key.startsWith('api_')) {
        apiCache.set(task.key, data);
      } else {
        globalCache.set(task.key, data);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  private calculatePriority(level: 'low' | 'medium' | 'high'): number {
    const priorities = { low: 1, medium: 5, high: 10 };
    return priorities[level];
  }

  private predictNextRoute(current: string, routes: string[]): Array<{route: string, probability: number}> {
    // Lógica simple de predicción basada en patrones comunes
    const patterns: Record<string, string[]> = {
      '/leads': ['/leads/construction', '/leads/design'],
      '/contacts': ['/contacts/new', '/leads/new-contact'],
      '/dashboard': ['/leads', '/contacts', '/projects'],
    };

    const predicted = patterns[current] || [];
    
    return predicted.map(route => ({
      route,
      probability: routes.includes(route) ? 0.8 : 0.3
    }));
  }

  private isIdle(): boolean {
    // Verificar si el navegador está idle
    return document.hidden === false && this.running.size < this.maxConcurrent;
  }

  private setupIdleCallback(): void {
    if (typeof window === 'undefined' || typeof window.requestIdleCallback === 'undefined') return;
    
    const processIdleTasks = () => {
      window.requestIdleCallback(() => {
        this.processQueue();
        processIdleTasks();
      });
    };
    processIdleTasks();
  }

  private setupIntersectionObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const key = element.getAttribute('data-prefetch-key');
            if (key) {
              // La callback se ejecutará automáticamente
              this.intersectionObserver?.unobserve(element);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
  }
}

// Función para crear la instancia del prefetch manager
function createPrefetchManager() {
  if (typeof window === 'undefined') {
    // Mock para el servidor
    return {
      add: () => {},
      prefetch: () => Promise.resolve(),
      onHover: () => {},
      onIntersection: () => {},
      processQueue: () => {},
      cleanup: () => {},
      getStats: () => ({ pending: 0, running: 0, completed: 0, failed: 0 }),
      destroy: () => {}
    } as any;
  }
  
  return new PrefetchManager();
}

// Instancia global del prefetch manager
export const prefetchManager = createPrefetchManager();

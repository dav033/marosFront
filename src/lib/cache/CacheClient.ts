// src/lib/cache/CacheClient.ts
import { type QueryKey, serializeKey } from "./key";
import type { Status, QueryOptions, Fetcher, SetDataOptions } from "./types";

type Listener = () => void;

interface Snapshot<TData = unknown> {
  data: TData | undefined;
  error: unknown;
  status: Status;
  updatedAt: number;
  isStale: boolean;
  isFetching: boolean;
}

interface Entry<TData = unknown> {
  // Con exactOptionalPropertyTypes: no escribir undefined, omitir o usar delete
  data?: TData;
  error?: unknown;
  status: Status;
  updatedAt: number;
  promise?: Promise<TData>;
  abort?: AbortController;
  listeners: Set<Listener>;
  staleTime: number;
  gcTimer?: ReturnType<typeof setTimeout>;
  _snapshot?: Snapshot<TData>;
}

function isWindowVisible() {
  if (typeof document === "undefined") return true;
  return document.visibilityState !== "hidden";
}

export class CacheClient {
  // Evita problemas de genéricos en Map
  private store = new Map<string, Entry<any>>();
  private defaultOptions: Required<
    Omit<QueryOptions<any>, "initialData" | "enabled">
  > = {
    staleTime: 0,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: true,
    refetchInterval: false,
  };

  // Reloj interno estable (no usar Date.now() en getSnapshot)
  private nowRef = Date.now();
  private bumpClock() {
    this.nowRef = Date.now();
  }

  constructor(opts?: Partial<typeof this.defaultOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...(opts ?? {}) };
    if (typeof window !== "undefined") {
      window.addEventListener("visibilitychange", () => {
        if (isWindowVisible()) this.refetchVisibleQueries();
      });
      window.addEventListener("focus", () => {
        if (this.defaultOptions.refetchOnWindowFocus)
          this.refetchVisibleQueries();
      });
    }
  }

  private getOrInit<TData>(
    key: string,
    options: QueryOptions<TData>
  ): Entry<TData> {
    const existing = this.store.get(key) as Entry<TData> | undefined;

    if (!existing) {
      const created: Entry<TData> = {
        // Omitimos props si están undefined para cumplir exactOptionalPropertyTypes
        ...(options.initialData !== undefined
          ? { data: options.initialData }
          : {}),
        status: options.initialData === undefined ? "idle" : "success",
        updatedAt: options.initialData === undefined ? 0 : this.nowRef,
        listeners: new Set<Listener>(),
        staleTime: options.staleTime ?? this.defaultOptions.staleTime,
      };
      this.store.set(key, created as Entry<any>);
      return created;
    }

    // Ya existe: aseguramos staleTime
    existing.staleTime =
      options.staleTime ?? existing.staleTime ?? this.defaultOptions.staleTime;
    return existing;
  }

  private scheduleGC(key: string, e: Entry<any>, gcTime: number) {
    if (e.gcTimer) {
      clearTimeout(e.gcTimer);
      delete e.gcTimer;
    }
    if (e.listeners.size > 0) return;
    e.gcTimer = setTimeout(() => {
      const still = this.store.get(key);
      if (still && still.listeners.size === 0) {
        if (still.abort) {
          try {
            still.abort.abort();
          } catch {}
          delete still.abort;
        }
        this.store.delete(key);
      }
    }, gcTime);
  }

  private notify(e: Entry<any>) {
    this.bumpClock();
    for (const l of e.listeners) {
      try {
        l();
      } catch {}
    }
  }

  subscribe(
    key: QueryKey,
    listener: Listener,
    options?: QueryOptions<unknown>
  ) {
    const sKey = serializeKey(key);
    const e = this.getOrInit(sKey, options ?? {});
    e.listeners.add(listener);
    if (e.gcTimer) {
      clearTimeout(e.gcTimer);
      delete e.gcTimer; // <- no asignar undefined
    }
    return () => {
      e.listeners.delete(listener);
      const gcTime = options?.gcTime ?? this.defaultOptions.gcTime;
      this.scheduleGC(sKey, e, gcTime);
    };
  }

  getSnapshot<TData>(key: QueryKey, options?: QueryOptions<TData>) {
    const sKey = serializeKey(key);
    const e = this.getOrInit<TData>(sKey, options ?? {});

    const stale =
      e.staleTime === 0 ? true : this.nowRef - e.updatedAt > e.staleTime;

    const next: Snapshot<TData> = {
      data: e.data as TData | undefined,
      error: e.error,
      status: e.status as Status,
      updatedAt: e.updatedAt,
      isStale: stale,
      isFetching: !!e.promise,
    };

    const prev = e._snapshot as Snapshot<TData> | undefined;
    if (
      prev &&
      prev.data === next.data &&
      prev.error === next.error &&
      prev.status === next.status &&
      prev.updatedAt === next.updatedAt &&
      prev.isStale === next.isStale &&
      prev.isFetching === next.isFetching
    ) {
      return prev; // misma referencia si no hay cambios
    }

    e._snapshot = next;
    return next;
  }

  async ensureQuery<TData>(
    key: QueryKey,
    fetcher: Fetcher<TData>,
    options: QueryOptions<TData> = {}
  ): Promise<TData> {
    const sKey = serializeKey(key);
    const e = this.getOrInit<TData>(sKey, options);
    const enabled = options.enabled ?? true;

    if (!enabled) {
      if (e.data !== undefined) return e.data as TData;
      e.status = "idle";
      this.notify(e);
      // devolvemos el dato (posiblemente undefined) pero casteado; el caller controla enabled
      return e.data as TData;
    }

    const stale =
      e.staleTime === 0 ? true : this.nowRef - e.updatedAt > e.staleTime;
    if (!stale && e.data !== undefined) return e.data as TData;

    if (e.promise) return e.promise;

    if (e.abort) {
      try {
        e.abort.abort();
      } catch {}
    }
    const ac = new AbortController();
    e.abort = ac;
    if (e.data === undefined) e.status = "loading";
    this.notify(e);

    const p: Promise<TData> = (async () => {
      try {
        const data = await fetcher({ signal: ac.signal, queryKey: key });
        e.data = data;
        delete e.error;
        e.status = "success";
        e.updatedAt = this.nowRef;
        return data;
      } catch (err) {
        if ((err as any)?.name === "AbortError") {
          if (e.data === undefined) e.status = "idle";
          throw err;
        }
        e.error = err;
        e.status = "error";
        throw err;
      } finally {
        delete e.promise; // <- no asignar undefined
        this.notify(e);
      }
    })();

    e.promise = p; // <- tipado correcto
    return p;
  }

  refetch<TData>(
    key: QueryKey,
    fetcher: Fetcher<TData>,
    options?: QueryOptions<TData>
  ) {
    const sKey = serializeKey(key);
    const e = this.getOrInit<TData>(sKey, options ?? {});
    e.updatedAt = 0; // fuerza stale
    return this.ensureQuery<TData>(key, fetcher, options ?? {});
  }

  setQueryData<TData>(
    key: QueryKey,
    updater: TData | ((old?: TData) => TData),
    opts?: SetDataOptions
  ) {
    const sKey = serializeKey(key);
    const e = this.getOrInit<TData>(sKey, {});
    const prev = e.data as TData | undefined;
    const next =
      typeof updater === "function" ? (updater as any)(prev) : updater;

    const shallowEqual =
      prev === next ||
      (prev &&
        next &&
        typeof prev === "object" &&
        typeof next === "object" &&
        Object.keys(next as any).every(
          (k) => (prev as any)[k] === (next as any)[k]
        ));

    if (opts?.silentIfEqual && shallowEqual) return;

    e.data = next;
    delete e.error;
    e.status = "success";
    e.updatedAt = this.nowRef;
    this.notify(e);
  }

  invalidate(keyPrefix?: QueryKey) {
    if (!keyPrefix || keyPrefix.length === 0) {
      for (const [, e] of this.store) {
        e.updatedAt = 0;
      }
      return;
    }
    const prefix = serializeKey(keyPrefix);
    for (const [k, e] of this.store) {
      if (k.startsWith(prefix.slice(0, -1))) {
        e.updatedAt = 0;
      }
    }
  }

  async prefetch<TData>(
    key: QueryKey,
    fetcher: Fetcher<TData>,
    options?: QueryOptions<TData>
  ) {
    return this.ensureQuery<TData>(key, fetcher, options ?? {});
  }

  private refetchVisibleQueries() {
    if (!isWindowVisible()) return;
    for (const [, e] of this.store) {
      if (e.listeners.size === 0) continue;
      const stale =
        e.staleTime === 0 ? true : this.nowRef - e.updatedAt > e.staleTime;
      if (stale && !e.promise && e.status !== "loading") {
        this.notify(e);
      }
    }
  }
}

export const cacheClient = new CacheClient();

import type { HttpClient, HttpResponse } from "./HttpClient";
import type { OptimizedApiClient} from "./OptimizedApiClient";
import {optimizedApiClient } from "./OptimizedApiClient";
import type { CachedRequestConfig } from "./types";

function mergeConfigs(a?: CachedRequestConfig, b?: CachedRequestConfig): CachedRequestConfig {
  if (!a) return b ?? {};
  if (!b) return a;
  return {
    ...a,
    ...b,
    cache: { ...(a.cache ?? {}), ...(b.cache ?? {}) },
    retry: { ...(a.retry ?? {}), ...(b.retry ?? {}) },
    prefetch: {
      ...(a.prefetch ?? {}),
      ...(b.prefetch ?? {}),
      dependencies: [
        ...((a.prefetch?.dependencies as string[] | undefined) ?? []),
        ...((b.prefetch?.dependencies as string[] | undefined) ?? []),
      ],
    },
    params: { ...(a.params ?? {}), ...(b.params ?? {}) },
    headers: { ...(a.headers ?? {}), ...(b.headers ?? {}) },
  };
}

export class OptimizedApiClientAdapter implements HttpClient {
  constructor(private readonly client: OptimizedApiClient = optimizedApiClient) {}

  async get<T = unknown>(url: string, config?: CachedRequestConfig): Promise<HttpResponse<T>> {
    const res = await this.client.get<T>(url, config);
    return { data: res.data, status: res.status };
  }
  async post<T = unknown>(url: string, body?: unknown, config?: CachedRequestConfig): Promise<HttpResponse<T>> {
    const res = await this.client.post<T>(url, body, config);
    return { data: res.data, status: res.status };
  }
  async put<T = unknown>(url: string, body?: unknown, config?: CachedRequestConfig): Promise<HttpResponse<T>> {
    const res = await this.client.put<T>(url, body, config);
    return { data: res.data, status: res.status };
  }
  async delete<T = unknown>(url: string, config?: CachedRequestConfig): Promise<HttpResponse<T>> {
    const res = await this.client.delete<T>(url, config);
    return { data: res.data, status: res.status };
  }

    withBase(
    base: string,
    defaults?: {
      get?: CachedRequestConfig;
      post?: CachedRequestConfig;
      put?: CachedRequestConfig;
      delete?: CachedRequestConfig;
    }
  ): HttpClient {
    const prefix = base.replace(/\/+$/, "");
    return {
      get: <T>(path: string, cfg?: CachedRequestConfig) =>
        this.get<T>(`${prefix}${path}`, mergeConfigs(defaults?.get, cfg)),
      post: <T>(path: string, body?: unknown, cfg?: CachedRequestConfig) =>
        this.post<T>(`${prefix}${path}`, body, mergeConfigs(defaults?.post, cfg)),
      put: <T>(path: string, body?: unknown, cfg?: CachedRequestConfig) =>
        this.put<T>(`${prefix}${path}`, body, mergeConfigs(defaults?.put, cfg)),
      delete: <T>(path: string, cfg?: CachedRequestConfig) =>
        this.delete<T>(`${prefix}${path}`, mergeConfigs(defaults?.delete, cfg)),
    };
  }
}

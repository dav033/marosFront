// src/shared/infra/http/OptimizedApiClient.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { HttpClientLike, RequestOptions } from '@/shared/infra/http/types';

const { VITE_API_BASE_URL } = import.meta.env;
const BASE_URL = VITE_API_BASE_URL || 'http://localhost:8080';

export class OptimizedApiClient implements HttpClientLike {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      // ⚠️ No fijes Content-Type global para no forzar preflight en GET
      withCredentials: false,
    });
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<{ data: T; status: number }> {
    const cfg: AxiosRequestConfig = { url, method };

    if (options?.headers) cfg.headers = options.headers;
    if (options?.params) cfg.params = options.params;
    if (options?.withCredentials !== undefined) cfg.withCredentials = options.withCredentials;
    if (options?.signal) cfg.signal = options.signal;

    if (body !== undefined) {
      cfg.data = body;
      // Solo cuando hay body, añade Content-Type si no vino ya
      // cfg.headers = { ...(cfg.headers ?? {}), 'Content-Type': 'application/json' };
    }

    const res = await this.axiosInstance.request<T>(cfg);
    return { data: res.data, status: res.status };
  }

  get<T = unknown>(url: string, options?: RequestOptions) {
    return this.request<T>('GET', url, undefined, options);
  }
  post<T = unknown>(url: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('POST', url, body, options);
  }
  put<T = unknown>(url: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('PUT', url, body, options);
  }
  delete<T = unknown>(url: string, options?: RequestOptions) {
    return this.request<T>('DELETE', url, undefined, options);
  }
}

// ✅ Exporta la instancia singleton que esperan tus repos
export const optimizedApiClient = new OptimizedApiClient(BASE_URL);

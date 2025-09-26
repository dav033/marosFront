import type { CachedRequestConfig } from "./types";

export interface HttpResponse<T> {
  data: T;
  status: number;
}

export interface HttpClient {
  get<T = unknown>(url: string, config?: CachedRequestConfig): Promise<HttpResponse<T>>;
  post<T = unknown>(url: string, body?: unknown, config?: CachedRequestConfig): Promise<HttpResponse<T>>;
  put<T = unknown>(url: string, body?: unknown, config?: CachedRequestConfig): Promise<HttpResponse<T>>;
  delete<T = unknown>(url: string, config?: CachedRequestConfig): Promise<HttpResponse<T>>;
}

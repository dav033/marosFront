import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableCache?: boolean;
  enableInterceptors?: boolean;
  defaultHeaders?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  timestamp: Date;
  requestId?: string;
}

export interface ApiInterceptors {
  onRequest?: (
    config: AxiosRequestConfig
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onResponse?: (
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>;
  onError?: (error: ApiError) => Promise<ApiError>;
}

export interface RequestConfig extends AxiosRequestConfig {
  retryAttempts?: number;
  cacheKey?: string;
  cacheTTL?: number;
  skipAuth?: boolean;
  skipRetry?: boolean;
  skipCache?: boolean;
}

export interface ApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
  setAuthToken(token: string): void;
  clearAuthToken(): void;
  setInterceptors(interceptors: ApiInterceptors): void;
  getConfig(): ApiClientConfig;
  updateConfig(config: Partial<ApiClientConfig>): void;
}

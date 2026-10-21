import type { SessionCookie } from './session';

export interface CookieStore {
  hasFile(): boolean;
  getCookies(baseURL: string): Promise<SessionCookie[]>;
  clear(): Promise<void>;
}

export interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface HttpCleint {
  get<T>(url: string, cfg?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, cfg?: RequestConfig): Promise<T>;
}

export type JsonBody = Record<string, unknown> | unknown[];

export interface Logger {
  debug(msg: string): void;
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string, err?: unknown): void;
}

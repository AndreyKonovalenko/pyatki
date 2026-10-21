import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import type { HttpCleint, RequestConfig, JsonBody } from '../domain/prots';
import { HttpError } from '../domain/auth';
import { ToughCookieStore } from './cookie-store';

export class AxiosHttpClient implements HttpCleint {
  private api: AxiosInstance;

  constructor(baseURL: string, cokiesStore: ToughCookieStore) {
    this.api = wrapper(axios).create({
      baseURL,
      jar: cokiesStore.getJar(),
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async get<T>(url: string, cfg?: RequestConfig): Promise<T> {
    return this.call(() => this.api.get<T>(url, cfg));
  }

  async post<T>(url: string, data?: JsonBody, cfg?: RequestConfig): Promise<T> {
    return this.call(() => this.api.post<T>(url, data, cfg));
  }

  private async call<T>(fn: () => Promise<{ data: T }>): Promise<T> {
    try {
      return (await fn()).data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new HttpError(err.response?.status ?? 0, err.message);
      }
      throw err;
    }
  }
}

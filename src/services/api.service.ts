import { HttpError } from '../models/error';
import type { HttpClient, JsonBody, RequestConfig } from '../models/ports';
import { AuthService } from './auth.service';

export class ApiService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  get<T>(url: string, cfg?: RequestConfig) {
    return this.withAuth(() => this.http.get<T>(url, cfg));
  }
  post<T>(url: string, data?: JsonBody, cfg?: RequestConfig) {
    return this.withAuth(() => this.http.post<T>(url, data, cfg));
  }

  private async withAuth<T>(requset: () => Promise<T>): Promise<T> {
    await this.auth.ensureAuthenticated();
    try {
      return await requset();
    } catch (err) {
      if (err instanceof HttpError && err.status === 403) {
        await this.auth.ensureAuthenticated();
        return requset();
      }
      throw err;
    }
  }
}

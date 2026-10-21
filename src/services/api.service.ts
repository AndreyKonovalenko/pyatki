import { HttpError } from '../domain/auth';
import type { HttpCleint, JsonBody, RequestConfig } from '../domain/prots';
import { AuthService } from './auth.service';

export class ApiService {
  constructor(
    private http: HttpCleint,
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

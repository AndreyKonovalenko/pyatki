import type { HttpClient } from '../models/ports';
import { AuthenticationError, type Credentials } from '../models/auth.model';

interface LoginRequestDto {
  UserName: string;
  Password: string;
}

export interface LoginResponse {
  status?: { methodStatus?: string };
}

export function isLoginSuccessful(res: LoginResponse): boolean {
  return res?.status?.methodStatus === 'Success';
}

export interface AuthApiConfig {
  loginPath: string;
  logoutPath: string;
}

function toLoginRequest(credentials: Credentials): LoginRequestDto {
  return {
    UserName: credentials.username,
    Password: credentials.password,
  };
}

export class AuthApiClient {
  constructor(
    private http: HttpClient,
    private cfg: AuthApiConfig,
  ) {}

  async login(credentials: Credentials): Promise<void> {
    const res = await this.http.post<LoginResponse>(
      this.cfg.loginPath,
      toLoginRequest(credentials),
    );
    if (isLoginSuccessful(res)) {
      throw new AuthenticationError('Login faild' + JSON.stringify(res));
    }
  }
  async logout(): Promise<void> {
    await this.http.post(this.cfg.logoutPath);
  }
}

import type { CookieStore, HttpCleint, Logger } from '../domain/prots';
import {
  AuthenticationError,
  isLoginSuccessful,
  LoginResponse,
} from '../domain/auth';
import { SessionService } from './session.service';

export interface AuthConfig {
  baseURL: string;
  tokenName: string;
  loginPath: string;
  username: string;
  password: string;
}

export class AuthService {
  private isAuthenticated = false;
  private authPromise: Promise<void> | null = null;
  constructor(
    private http: HttpCleint,
    private store: CookieStore,
    private session: SessionService,
    private logger: Logger,
    private cfg: AuthConfig,
  ) {}

  async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticated) return;
    if (this.authPromise) return this.authPromise;

    this.authPromise = this.authenticate();
    try {
      await this.authPromise;
    } finally {
      this.authPromise = null;
    }
  }

  private async authenticate(): Promise<void> {
    if (
      await this.session.isLocallyValid(this.cfg.baseURL, this.cfg.tokenName)
    ) {
      this.isAuthenticated = true;
      this.logger.info('✅ Using stored session');
      return;
    }
    if (this.store.hasFile()) await this.store.clear();
    await this.login();
  }

  async login(): Promise<void> {
    const { username, password, loginPath } = this.cfg;
    if (!username || !password) {
      throw new AuthenticationError('Misssing credentials');
    }
    this.logger.info('🔐 Logging in...');
    const res = await this.http.post<LoginResponse>(loginPath, {
      UserName: username,
      Password: password,
    });
    if (!isLoginSuccessful(res)) {
      throw new AuthenticationError('Login failed' + JSON.stringify(res));
    }
    this.isAuthenticated = true;
    this.logger.info('✅ Authentication successful');
  }

  async reauthenticate(): Promise<void> {
    this.isAuthenticated = false;
    this.authPromise = null;
    await this.store.clear();
    await this.ensureAuthenticated();
  }

  async logout(): Promise<void> {
    this.isAuthenticated = false;
    this.authPromise = null;
    await this.store.clear();
    this.logger.info('🔓 Logged out');
  }
}

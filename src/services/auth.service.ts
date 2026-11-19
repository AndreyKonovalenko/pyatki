import type { CookieStore, HttpClient, Logger } from '../models/ports';
import { AuthenticationError } from '../models/auth.model';
import type { AuthApiClient } from '../infrastructure/auth-api.client';
import { SessionService } from './session.service';

export interface AuthConfig {
  baseURL: string;
  tokenName: string;
  username: string;
  password: string;
}

export class AuthService {
  private isAuthenticated = false;
  private authPromise: Promise<void> | null = null;
  constructor(
    private authClient: AuthApiClient,
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
    if (!this.cfg.username || !this.cfg.password) {
      throw new AuthenticationError('Misssing credentials');
    }
    this.logger.info('🔐 Logging in...');
    await this.authClient.login({
      username: this.cfg.username,
      password: this.cfg.password,
    });
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

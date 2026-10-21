import type { CookieStore, Logger } from '../domain/prots';
import { SessionCookie, isValidSession } from '../domain/session';

export class SessionService {
  constructor(
    private store: CookieStore,
    private logger: Logger,
  ) {}

  async isLocallyValid(baseURL: string, tokenName: string): Promise<boolean> {
    if (!this.store.hasFile()) {
      this.logger.debug('❌ No cookie file — need to login');
      return false;
    }

    let cookies: SessionCookie[];
    try {
      cookies = await this.store.getCookies(baseURL);
    } catch (err) {
      this.logger.warn('❌ Failed to read cookie jar');
      return false;
    }
    const valid = isValidSession(cookies, tokenName);
    this.logger.debug(
      valid ? '✅ Session locally valid' : '❌ Session invalid',
    );
    return valid;
  }
}

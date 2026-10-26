'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SessionService = void 0;
const session_1 = require('../domain/session');
class SessionService {
  constructor(store, logger) {
    this.store = store;
    this.logger = logger;
  }
  async isLocallyValid(baseURL, tokenName) {
    if (!this.store.hasFile()) {
      this.logger.debug('❌ No cookie file — need to login');
      return false;
    }
    let cookies;
    try {
      cookies = await this.store.getCookies(baseURL);
    } catch (err) {
      this.logger.warn('❌ Failed to read cookie jar');
      return false;
    }
    const valid = (0, session_1.isValidSession)(cookies, tokenName);
    this.logger.debug(
      valid ? '✅ Session locally valid' : '❌ Session invalid',
    );
    return valid;
  }
}
exports.SessionService = SessionService;

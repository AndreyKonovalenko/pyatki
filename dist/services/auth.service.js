'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthService = void 0;
const auth_1 = require('../domain/auth');
class AuthService {
  constructor(http, store, session, logger, cfg) {
    this.http = http;
    this.store = store;
    this.session = session;
    this.logger = logger;
    this.cfg = cfg;
    this.isAuthenticated = false;
    this.authPromise = null;
  }
  async ensureAuthenticated() {
    if (this.isAuthenticated) return;
    if (this.authPromise) return this.authPromise;
    this.authPromise = this.authenticate();
    try {
      await this.authPromise;
    } finally {
      this.authPromise = null;
    }
  }
  async authenticate() {
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
  async login() {
    const { username, password, loginPath } = this.cfg;
    if (!username || !password) {
      throw new auth_1.AuthenticationError('Misssing credentials');
    }
    this.logger.info('🔐 Logging in...');
    const res = await this.http.post(loginPath, {
      UserName: username,
      Password: password,
    });
    if (!(0, auth_1.isLoginSuccessful)(res)) {
      throw new auth_1.AuthenticationError(
        'Login failed' + JSON.stringify(res),
      );
    }
    this.isAuthenticated = true;
    this.logger.info('✅ Authentication successful');
  }
  async reauthenticate() {
    this.isAuthenticated = false;
    this.authPromise = null;
    await this.store.clear();
    await this.ensureAuthenticated();
  }
  async logout() {
    this.isAuthenticated = false;
    this.authPromise = null;
    await this.store.clear();
    this.logger.info('🔓 Logged out');
  }
}
exports.AuthService = AuthService;

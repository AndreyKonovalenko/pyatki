'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ApiService = void 0;
const auth_1 = require('../domain/auth');
class ApiService {
  constructor(http, auth) {
    this.http = http;
    this.auth = auth;
  }
  get(url, cfg) {
    return this.withAuth(() => this.http.get(url, cfg));
  }
  post(url, data, cfg) {
    return this.withAuth(() => this.http.post(url, data, cfg));
  }
  async withAuth(requset) {
    await this.auth.ensureAuthenticated();
    try {
      return await requset();
    } catch (err) {
      if (err instanceof auth_1.HttpError && err.status === 403) {
        await this.auth.ensureAuthenticated();
        return requset();
      }
      throw err;
    }
  }
}
exports.ApiService = ApiService;

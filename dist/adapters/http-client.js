'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AxiosHttpClient = void 0;
const axios_1 = __importDefault(require('axios'));
const axios_cookiejar_support_1 = require('axios-cookiejar-support');
const auth_1 = require('../domain/auth');
class AxiosHttpClient {
  constructor(baseURL, cokiesStore) {
    this.api = (0, axios_cookiejar_support_1.wrapper)(axios_1.default).create({
      baseURL,
      jar: cokiesStore.getJar(),
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }
  async get(url, cfg) {
    return this.call(() => this.api.get(url, cfg));
  }
  async post(url, data, cfg) {
    return this.call(() => this.api.post(url, data, cfg));
  }
  async call(fn) {
    var _a, _b;
    try {
      return (await fn()).data;
    } catch (err) {
      if (axios_1.default.isAxiosError(err)) {
        throw new auth_1.HttpError(
          (_b =
            (_a = err.response) === null || _a === void 0
              ? void 0
              : _a.status) !== null && _b !== void 0
            ? _b
            : 0,
          err.message,
        );
      }
      throw err;
    }
  }
}
exports.AxiosHttpClient = AxiosHttpClient;

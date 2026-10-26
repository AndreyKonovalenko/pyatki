'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ToughCookieStore = void 0;
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const tough_cookie_1 = require('tough-cookie');
const tough_cookie_file_store_1 = __importDefault(
  require('tough-cookie-file-store'),
);
class ToughCookieStore {
  constructor(filePath) {
    this.filePath = filePath;
    fs_1.default.mkdirSync(path_1.default.dirname(filePath), {
      recursive: true,
    });
    this.jar = new tough_cookie_1.CookieJar(
      new tough_cookie_file_store_1.default(filePath),
    );
  }
  getJar() {
    return this.jar;
  }
  hasFile() {
    return fs_1.default.existsSync(this.filePath);
  }
  async getCookies(baseURL) {
    const cookies = await this.jar.getCookies(baseURL);
    return cookies.map(c => {
      var _a;
      return {
        key: c.key,
        value: c.value,
        expires: c.expires instanceof Date ? c.expires : undefined,
        domain: (_a = c.domain) !== null && _a !== void 0 ? _a : undefined,
      };
    });
  }
  async clear() {
    this.jar.removeAllCookiesSync();
    if (this.hasFile()) fs_1.default.unlinkSync(this.filePath);
  }
}
exports.ToughCookieStore = ToughCookieStore;

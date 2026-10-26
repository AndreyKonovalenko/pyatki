'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createApp = createApp;
const path_1 = __importDefault(require('path'));
const config_1 = __importDefault(require('./config'));
const cookie_store_1 = require('./adapters/cookie-store');
const http_client_1 = require('./adapters/http-client');
const console_logger_1 = require('./adapters/console-logger');
const session_service_1 = require('./services/session.service');
const auth_service_1 = require('./services/auth.service');
const api_service_1 = require('./services/api.service');
const company_service_1 = require('./services/company.service');
const company_overview_usecase_1 = require('./use-cases/company-overview.usecase');
function createApp() {
  const logger = new console_logger_1.ConsoleLogger();
  const cookieFile = path_1.default.join(
    process.cwd(),
    'storage',
    'cookies',
    'session.json',
  );
  const store = new cookie_store_1.ToughCookieStore(cookieFile);
  const http = new http_client_1.AxiosHttpClient(
    config_1.default.endpoints.baseURL,
    store,
  );
  const session = new session_service_1.SessionService(store, logger);
  const auth = new auth_service_1.AuthService(http, store, session, logger, {
    baseURL: config_1.default.endpoints.baseURL,
    tokenName: config_1.default.auth.tokenName,
    loginPath: config_1.default.endpoints.login,
    username: config_1.default.auth.username,
    password: config_1.default.auth.password,
  });
  const api = new api_service_1.ApiService(http, auth);
  const company = new company_service_1.CompanyService(http);
  const companyOverview = new company_overview_usecase_1.CompanyOverviewUseCase(
    company,
    logger,
  );
  return { logger, store, http, session, auth, api, companyOverview };
}

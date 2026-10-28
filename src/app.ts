import path from 'path';
import config from './config';
import { ToughCookieStore } from './adapters/cookie-store';
import { AxiosHttpClient } from './adapters/http-client';
import { ConsoleLogger } from './adapters/console-logger';
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { CompanyService } from './services/company.service';
import { CompanyOverviewUseCase } from './use-cases/company-overview.usecase';

export function createApp() {
  const logger = new ConsoleLogger();
  const cookieFile = path.join(
    process.cwd(),
    'storage',
    'cookies',
    'session.json',
  );
  const store = new ToughCookieStore(cookieFile);
  const http = new AxiosHttpClient(config.endpoints.baseURL, store);
  const session = new SessionService(store, logger);
  const auth = new AuthService(http, store, session, logger, {
    baseURL: config.endpoints.baseURL,
    tokenName: config.auth.tokenName,
    loginPath: config.endpoints.login,
    username: config.auth.username,
    password: config.auth.password,
  });
  const api = new ApiService(http, auth);
  const company = new CompanyService(http);
  const companyOverview = new CompanyOverviewUseCase(company, logger);
  return { logger, store, http, session, auth, api, companyOverview, config };
}
export type App = ReturnType<typeof createApp>;

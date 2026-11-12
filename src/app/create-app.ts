import path from 'path';
import config from '../config';
import { ToughCookieStore } from '../infrastructure/file-cookie-store';
import { AxiosHttpClient } from '../infrastructure/axios-http-client';
import { ConsoleLogger } from '../infrastructure/console-logger';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { CompanyApiClient } from '../infrastructure/company-api.client';
import { AuthApiClient } from '../infrastructure/auth-api.client';
import { CompanyOverviewUseCase } from '../use-cases/company-overview.usecase';

export function createApp() {
  // Infrastructure
  const logger = new ConsoleLogger()
  const cookieFile = path.join(
    process.cwd(),
    'storage',
    'cookies',
    'session.json',
  );
  const store = new ToughCookieStore(cookieFile);
  const http = new AxiosHttpClient(config.endpoints.baseURL, store);

  // Services
  const session = new SessionService(store, logger);
  const authApiClient = new AuthApiClient(http , {
    loginPath: config.endpoints.login,
    logoutPath: config.endpoints.logout
  })
  const auth = new AuthService(authApiClient, store, session, logger, {
    baseURL: config.endpoints.baseURL,
    tokenName: config.auth.tokenName,
    username: config.auth.username,
    password: config.auth.password,
  });
  const api = new ApiService(http, auth);

  // Api clients: 
  const company = new CompanyApiClient(api, {
    getCard: config.endpoints.get_company_card});

  // Use cases
  const companyOverview = new CompanyOverviewUseCase(company, logger);


  return { logger, store, http, session, auth, api, companyOverview };
}
export type App = ReturnType<typeof createApp>;

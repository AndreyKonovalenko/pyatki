import type { App } from '../app';
import { CliArgs } from '../domain/methods';
import { parseCliArgs } from './cli-parser';
import { METHOD_ENDPOINTS, CUSTOM_METHODS } from './methods';

type Hander = (app: App, args: CliArgs) => Promise<void>;

const handlers: Record<string, Hander> = {
  [CUSTOM_METHODS.company_overview]: async (app, { inn, year }) => {
    // const result = await app.companyOverview.run({inn, year});
    // app.logger.info(JSON.stringify(XPathResult, null, 2))
  },
};

const callEndpoints: Hander = async (app, { method, inn, year }) => {
  const endpoint = METHOD_ENDPOINTS[method];
  app.logger.info(`🔍 Calling ${method}${inn ? ` for INN ${inn}` : ''}...`);
  const result = await app.api.get(endpoint, {
    params: {
      ...(inn && { inn }),
      ...(year && { year }),
    },
  });
  app.logger.info('✅ Result: ' + JSON.stringify(result, null, 2));
};

export async function runCli(argv: string[], app: App): Promise<number> {
  try {
    const args = parseCliArgs(argv);
    const handler = handlers[args.method] ?? callEndpoints;
    await handler(app, args);
    return 0;
  } catch (err) {
    app.logger.error(
      '❌ Error',
      err instanceof Error ? err.message : String(err),
    );
    return 1;
  }
}

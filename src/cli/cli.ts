import type { App } from '../app';
import { CliArgs } from '../domain/methods';
import { parseCliArgs } from './cli-parser';
import { METHOD_ENDPOINTS, CUSTOM_METHODS } from './methods';

type Hander = (app: App, args: CliArgs) => Promise<void>;
const MAX_INNS_PER_CALL = 5;

const handlers: Record<string, Hander> = {
  [CUSTOM_METHODS.company_overview]: async (app, { inns }) => {
    if (inns.length > MAX_INNS_PER_CALL) {
      throw new Error(
        `Too many INNs: ${inns.length}.` +
          `Inns limit ${MAX_INNS_PER_CALL} for comompany_overiew method exceeded` +
          'Use batch_overveiw',
      );
    }
    if (inns.length === 0) {
      throw new Error(`Inn should not be empty`);
    }

    for (const inn of inns) {
      const label = `INN ${inn}`;
      app.logger.info(
        `🔍 Calling ${CUSTOM_METHODS.company_overview} for ${label}...`,
      );
      try {
        const result = await app.companyOverview.run(inn);
        app.logger.info(JSON.stringify(result, null, 2));
      } catch (err) {
        app.logger.error(
          `❌ Error [${label}]: ` +
            (err instanceof Error ? err.message : String(err)),
        );
      }
    }
  },
};

const callEndpoints: Hander = async (app, { method, inns, year }) => {
  const endpoint = METHOD_ENDPOINTS[method];

  app.logger.info(`🔍 Calling ${method}${inns ? ` for INN ${inns}` : ''}...`);
  const result = await app.api.get(endpoint, {
    params: {
      ...(inns && { inns }),
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

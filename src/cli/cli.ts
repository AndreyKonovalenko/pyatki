import type { App } from '../app';
import { CliArgs } from '../domain/methods';
import { runCompanyOverviewBatch } from '../use-cases/company-overview.batch';
import { parseCliArgs } from './cli-parser';
import { METHOD_ENDPOINTS, CUSTOM_METHODS } from './methods';

type Handler = (app: App, args: CliArgs) => Promise<void>;
const MAX_INNS_PER_CALL = 5;

const companyOvervew: Handler = async (app, { inns }) => {
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
};

const batchOvervew: Handler = async app => {
  const { inputFilePath, outputFilePath, concurrency } = app.config.batch;
  await runCompanyOverviewBatch(
    app.companyOverview,
    app.logger,
    inputFilePath,
    outputFilePath,
    concurrency,
  );
};

const handlers: Record<string, Handler> = {
  [CUSTOM_METHODS.company_overview]: companyOvervew,
};

const callEndpoints: Handler = async (app, { method, inns, year }) => {
  const endpoint = METHOD_ENDPOINTS[method];
  if (inns.length > MAX_INNS_PER_CALL) {
    `Too many INNs: ${inns.length}.` +
      `Inns limit ${MAX_INNS_PER_CALL} for ${method} method exceeded`;
  }
  for (const inn of inns) {
    const label = `INN ${inn}`;
    app.logger.info(`🔍 Calling ${method}${inn ? ` for INN ${inn}` : ''}...`);
    try {
      const result = await app.api.get(endpoint, {
        params: {
          ...(inn && { inn }),
          ...(year && { year }),
        },
      });
      app.logger.info('✅ Result: ' + JSON.stringify(result, null, 2));
    } catch (err) {
      app.logger.error(
        `❌ Error [${label}]: ` +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  }
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

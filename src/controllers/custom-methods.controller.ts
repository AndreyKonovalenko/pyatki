import type { App } from '../app/create-app';
import type { QueryArgs } from '../models/methods';
import {
  CUSTOM_METHODS,
  MAX_INNS_PER_CALL,
  parseInnList,
  validateArgs,
} from '../models/methods';
import type { CompanyOverviewResult } from '../models/company.model';
import {
  BatchSummary,
  runCompanyOverviewBatch,
} from '../use-cases/company-overview.batch';
import config from '../config';

export type CustomResult =
  | {
      method: string;
      result: Array<
        | { inn: string; ok: true; data: CompanyOverviewResult }
        | { inn: string; ok: false; error: string }
      >;
    }
  | {
      method: string;
      summary: BatchSummary;
    };

export async function customMethodsController(
  app: App,
  args: QueryArgs,
): Promise<CustomResult> {
  switch (args.method) {
    case CUSTOM_METHODS.company_overview:
      return {
        method: CUSTOM_METHODS.company_overview,
        result: await runCompanyOverview(app, args),
      };
    case CUSTOM_METHODS.batch_overview:
      await runBatch(app);
      return {
        method: CUSTOM_METHODS.batch_overview,
        summary: await runBatch(app),
      };
    default:
      throw new Error(`Unknown custom method: "${args.method}"`);
  }
}

async function runCompanyOverview(app: App, args: QueryArgs) {
  validateArgs(args, Object.values(CUSTOM_METHODS));
  const { inn } = args;
  const inns = parseInnList(inn);
  const result: Array<
    | { inn: string; ok: true; data: CompanyOverviewResult }
    | { inn: string; ok: false; error: string }
  > = [];
  if (inns.length > MAX_INNS_PER_CALL) {
    throw new Error(
      `Too many INNs: ${inns.length}.` +
        `Inns limit ${MAX_INNS_PER_CALL} for ${CUSTOM_METHODS.company_overview}   method exceeded`,
    );
  }

  for (const inn of inns) {
    const label = `INN ${inn}`;
    app.logger.info(
      `🔍 Calling ${CUSTOM_METHODS.company_overview} for ${label}...`,
    );
    try {
      const data = await app.companyOverview.run(inn);
      result.push({ inn, ok: true, data });
      app.logger.info(JSON.stringify(result, null, 2));
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      app.logger.error(
        `❌ Error [${label}]: ` +
          (err instanceof Error ? err.message : String(err)),
      );
      result.push({ inn, ok: false, error });
    }
  }
  return result;
}

async function runBatch(app: App) {
  const { inputFilePath, outputFilePath, concurrency } = config.batch;
  return runCompanyOverviewBatch(
    app.companyOverview,
    app.logger,
    inputFilePath,
    outputFilePath,
    concurrency,
  );
}

import type { App } from '../app/create-app';
import {
  METHOD_ENDPOINTS,
  MAX_INNS_PER_CALL,
  validateArgs,
  ALL_METHODS,
  needsInn,
} from '../models/methods';
import { QueryArgs, parseInnList } from '../models/methods';

export type MethodDespatherResult = {
  inn: string | null;
  result?: unknown;
  error?: string;
};

export async function methodDispatcher(
  app: App,
  args: QueryArgs,
): Promise<MethodDespatherResult[]> {
  validateArgs(args, ALL_METHODS);
  const endpoint = METHOD_ENDPOINTS[args.method];
  const { inn, method, year } = args;

  const inns = parseInnList(inn);

  if (inns.length > MAX_INNS_PER_CALL) {
    throw new Error(
      `Too many INNs: ${inns.length}.` +
        `Inns limit ${MAX_INNS_PER_CALL} for ${method} method exceeded`,
    );
  }
  const targets: (string | null)[] =
    needsInn(method) && inns.length > 0 ? inns : [null];
  const results: MethodDespatherResult[] = [];
  for (const inn of targets) {
    const label = `INN ${inn}`;
    app.logger.info(`🔍 Calling ${method}${inn ? ` for INN ${inn}` : ''}...`);
    try {
      const result = await app.api.get(endpoint, {
        params: {
          ...(inn && { inn }),
          ...(year && { year }),
        },
      });
      results.push({ inn, result });
      // app.logger.info('✅ Result: ' + JSON.stringify(result, null, 2));
    } catch (err) {
      app.logger.error(
        `❌ Error [${label}]: ` +
          (err instanceof Error ? err.message : String(err)),
      );
      results.push({
        inn,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return results;
}

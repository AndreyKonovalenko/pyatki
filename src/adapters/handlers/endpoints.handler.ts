import type{ App } from "../../app/create-app";
import { CliArgs, MAX_INNS_PER_CALL } from "../../models/methods";
import { METHOD_ENDPOINTS } from "../../cli/methods";


export async function endpointsHandler(app: App, { method, inns, year }: CliArgs){
  const endpoint = METHOD_ENDPOINTS[method];
  if (inns.length > MAX_INNS_PER_CALL) {
    throw new Error(
      `Too many INNs: ${inns.length}.` +
        `Inns limit ${MAX_INNS_PER_CALL} for ${method} method exceeded`,
    );
  }

  const targets: (string | null)[] = inns.length > 0 ? inns : [null];
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
      app.logger.info('✅ Result: ' + JSON.stringify(result, null, 2));
    } catch (err) {
      app.logger.error(
        `❌ Error [${label}]: ` +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  }
};
import type { App } from '../app/create-app';
import { isCustomMethod, QueryArgs } from '../models/methods';
import { customMethodsController } from '../controllers/custom-methods.controller';
import { rawMethodsController } from '../controllers/raw-methods.controller';
import { ALL_METHODS } from '../models/methods';
import { validateArgs } from '../models/methods';

export async function runCli(app: App, argv: string[]): Promise<number> {
  try {
    const args = parseCliArgs(argv);

    const result = isCustomMethod(args.method)
      ? await customMethodsController(app, args)
      : await rawMethodsController(app, args);

    console.log(JSON.stringify(result, null, 2));
    return 0;
  } catch (err) {
    app.logger.error(
      `❌ Error: ${err instanceof Error ? err.message : String(err)}`,
    );
    return 1;
  }
}

function parseCliArgs(argv: string[]): QueryArgs {
  const get = (prefix: string): string => {
    const found = argv.find(a => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : '';
  };
  const method = get('--method=');
  if (!method) {
    throw new Error(
      `Missing --method=<name>\nAvailabe: ${ALL_METHODS.join(', \n')}`,
    );
  }
  console.log(ALL_METHODS);
  const inn = get('--inn=');
  const year = get('--year=');
  const args: QueryArgs = { method, inn, year };
  validateArgs(args, ALL_METHODS);
  return args;
}

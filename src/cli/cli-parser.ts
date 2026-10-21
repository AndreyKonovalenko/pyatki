import { CliArgs, validateArgs } from '../domain/methods';
import { ALL_METHODS } from './methods';

export function parseCliArgs(argv: string[]): CliArgs {
  const get = (prefix: string): string => {
    const found = argv.find(a => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : '';
  };

  const method = get('--method=');
  const inn = get('--inn=');
  const year = get('--year=');

  if (!method) {
    throw new Error(
      `Missing --method=<name>\nAvailabe: ${ALL_METHODS.join(', \n')}`,
    );
  }

  console.log(ALL_METHODS);
  const args: CliArgs = { method, inn, year };
  validateArgs(args, ALL_METHODS);
  return args;
}

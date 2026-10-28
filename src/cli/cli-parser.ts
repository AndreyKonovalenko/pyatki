import { CliArgs, validateArgs } from '../domain/methods';
import { ALL_METHODS } from './methods';

export function parseCliArgs(argv: string[]): CliArgs {
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

  const inns = parseInnList(get('--inn='));
  const year = get('--year=');

  console.log(ALL_METHODS);

  const args: CliArgs = { method, inns, year };
  validateArgs(args, ALL_METHODS);
  return args;
}

/**
 * Accepts:
 *   --inn=7700000000                     → ['7700000000']
 *   --inn=7700000000,777000000           → ['7700000000', '777000000']
 *   --inn=[7700000000, 777000000]        → ['7700000000', '777000000']
 *   --inn=                               → []
 *   (no --inn at all)                    → []
 */

function parseInnList(raw: string): string[] {
  if (!raw) return [];
  const cleaned = raw.replace(/^\[|\]$/g, '');
  return cleaned
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

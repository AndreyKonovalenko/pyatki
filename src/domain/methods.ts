export interface CliArgs {
  method: string;
  inn: string;
  year: string;
}

export const METHODS_WITHOUT_INN: readonly string[] = ['check_balance'];
export const METHODS_WITH_YEAR: readonly string[] = [
  'get_company_financial_report',
];

export function isValidInn(inn: string): boolean {
  return /^\d{10}$|^\d{12}$/.test(inn);
}

export function isValidYear(year: string): boolean {
  return /^(19\d{2}|20\d{2}|2100)$/.test(year);
}

export function needsInn(method: string): boolean {
  return !METHODS_WITHOUT_INN.includes(method);
}

export function needsYear(method: string): boolean {
  return METHODS_WITH_YEAR.includes(method);
}

export function validateArgs(args: CliArgs, knownMethods: string[]): void {
  if (!knownMethods.includes(args.method)) {
    throw new Error(
      `Unknown method: "${args.method}"\nAvailable: ${knownMethods.join(', \n')}`,
    );
  }
  if (needsInn(args.method) && !isValidInn(args.inn)) {
    throw new Error(`Invalid INN: "${args.inn}" — must be 10 or 12 digits`);
  }
  if (needsYear(args.method) && !isValidYear(args.year)) {
    throw new Error(
      `Invalid Year: "${args.year}" — must be 4 digits starting with 19 or 20`,
    );
  }
}

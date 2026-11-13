import config from "../config";
const {endpoints} = config;

export interface QueryArgs {
  method: string;
  inn:  string;
  year: string;
}

export const MAX_INNS_PER_CALL = 5;

export const METHODS_WITHOUT_INN: readonly string[] = [
  'check_balance',
  'batch_overview',
];
export const METHODS_WITH_YEAR: readonly string[] = [
  'get_company_financial_report',
];


export const CUSTOM_METHODS = {
  company_overview: 'company_overview',
  // batch_overview: 'batch_overview',
};

export const METHOD_ENDPOINTS: Record<string, string> = {
  check_balance: endpoints.check_balance,
  get_company_card: endpoints.get_company_card,
  get_company_court_cases: endpoints.get_company_court_cases,
  get_company_bailiffs: endpoints.get_company_bailiffs,
  get_company_owners: endpoints.get_company_owners,
  get_company_financial_report: endpoints.get_company_financial_report,
  get_company_suppliers_blacklist: endpoints.get_company_suppliers_blacklist,
  get_entrepreneur_card: endpoints.get_entrepreneur_card,
};

export const ALL_METHODS = [
  ...Object.keys(METHOD_ENDPOINTS),
  ...Object.values(CUSTOM_METHODS),
];

export function parseInnList(inn:string | undefined):string[] {
   return (inn ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
} 
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

export function validateArgs(args: QueryArgs, knownMethods: string[]): void {
  const inns = parseInnList(args.inn)
  // Method must be known
  if (!knownMethods.includes(args.method)) {
    throw new Error(
      `Unknown method: "${args.method}"\nAvailable: ${knownMethods.join(', \n')}`,
    );
  }

  // Methods that requier INN should have at least one INN
  if (needsInn(args.method) && inns.length === 0) {
    throw new Error(`Method "${args.method}" requiers at least one --inn`);
  }

  // Every INN must be valid
  for (const inn of inns) {
    if (!isValidInn(inn)) {
      throw new Error(`Invalid INN: "${args.inn}" — must be 10 or 12 digits`);
    }
  }

  if (needsYear(args.method) && !isValidYear(args.year)) {
    throw new Error(
      `Invalid Year: "${args.year}" — must be 4 digits starting with 19 or 20`,
    );
  }
}

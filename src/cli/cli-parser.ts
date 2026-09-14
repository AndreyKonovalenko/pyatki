import { METHOD_ENDPOINTS, METHODS_WITHOUT_INN, METHODS_WITH_YEAR } from './methods';

export interface CliArgs {
  method: string;
  inn: string;
  year: string;
}

//Example
//npx tsx src/main.ts --method=get_company_card --inn=7777777777
// npm run card -- --inn=7777777777   


export function getCliArgs(): CliArgs {
  const args = process.argv.slice(2);
 
  const methodArg = args.find(a => a.startsWith('--method='));
  const innArg = args.find(a => a.startsWith('--inn='));
  const yearArg = args.find(a =>a.startsWith('--year='))

  if (!methodArg) {
    throw new Error(
      `Missing --method=<name>\nAvailable: ${Object.keys(METHOD_ENDPOINTS).join(', ')}`
    );
  }

  const method = methodArg.split('=')[1];
  const inn = innArg ? innArg.split('=')[1] : '';
  const year = yearArg ? yearArg.split('=')[1] : ''

  if (!METHOD_ENDPOINTS[method]) {
    throw new Error(`Unknown method: "${method}"`);
  }

  if (!METHODS_WITHOUT_INN.includes(method) && !/^\d{10}$|^\d{12}$/.test(inn)) {
    throw new Error(`Invalid INN: "${inn}" — must be 10 or 12 digits`);
  }

  if(!METHODS_WITH_YEAR.includes(method)&& /^(19\d{2}|20\d{2}|2100)$/.test(year)) {
    throw new Error(`Invalid Year: "${year}" — must be 4 digits starting with 19 or 20`);
  }

  return { method, inn, year };
}
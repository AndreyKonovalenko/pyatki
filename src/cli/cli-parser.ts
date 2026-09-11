import { METHOD_ENDPOINTS, METHODS_WITHOUT_INN } from './methods';

export interface CliArgs {
  method: string;
  inn: string;
}

//Example
//npx tsx src/main.ts --method=get_company_card --inn=7777777777
// npm run card -- --inn=7777777777   

export function getCliArgs(): CliArgs {
  const args = process.argv.slice(2);
 
  const methodArg = args.find(a => a.startsWith('--method='));
  const innArg = args.find(a => a.startsWith('--inn='));

  if (!methodArg) {
    throw new Error(
      `Missing --method=<name>\nAvailable: ${Object.keys(METHOD_ENDPOINTS).join(', ')}`
    );
  }

  const method = methodArg.split('=')[1];
  const inn = innArg ? innArg.split('=')[1] : '';

  if (!METHOD_ENDPOINTS[method]) {
    throw new Error(`Unknown method: "${method}"`);
  }

  if (!METHODS_WITHOUT_INN.includes(method) && !/^\d{10}$|^\d{12}$/.test(inn)) {
    throw new Error(`Invalid INN: "${inn}" — must be 10 or 12 digits`);
  }

  return { method, inn };
}
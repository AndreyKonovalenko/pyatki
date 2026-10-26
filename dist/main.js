'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const app_1 = require('./app');
const cli_1 = require('./cli/cli');
async function main() {
  const app = (0, app_1.createApp)();
  try {
    process.exit(await (0, cli_1.runCli)(process.argv.slice(2), app));
  } catch (err) {
    app.logger.error('❌ Fatal error', err);
    process.exit(1);
  }
}
main();
// import { authService } from './services/auth-service';
// import { getCliArgs } from './cli/cli-parser';
// import { METHOD_ENDPOINTS } from './cli/methods';
// async function main() {
//   try {
//     const { method, inn, year } = getCliArgs();
//     const endpoint = METHOD_ENDPOINTS[method];
//     console.log(`🔍 Calling ${method}${inn ? ` for INN ${inn}` : ''}...`);
//     await authService.authenticate();
//     const result = await authService.get(endpoint, {
//       params: {
//         ...(inn && { inn }),
//         ...(year && { year }),
//       } ,
//     });
//     console.log('✅ Result:', JSON.stringify(result, null, 2));
//   } catch (error) {
//     console.error('❌ Error:', error instanceof Error ? error.message : error);
//     process.exit(1);
//   }
// }
// main();

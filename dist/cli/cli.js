'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.runCli = runCli;
const cli_parser_1 = require('./cli-parser');
const methods_1 = require('./methods');
const handlers = {
  [methods_1.CUSTOM_METHODS.company_overview]: async (app, { inn }) => {
    const result = await app.companyOverview.run(inn);
    app.logger.info(JSON.stringify(result, null, 2));
  },
};
const callEndpoints = async (app, { method, inn, year }) => {
  const endpoint = methods_1.METHOD_ENDPOINTS[method];
  app.logger.info(`🔍 Calling ${method}${inn ? ` for INN ${inn}` : ''}...`);
  const result = await app.api.get(endpoint, {
    params: {
      ...(inn && { inn }),
      ...(year && { year }),
    },
  });
  app.logger.info('✅ Result: ' + JSON.stringify(result, null, 2));
};
async function runCli(argv, app) {
  var _a;
  try {
    const args = (0, cli_parser_1.parseCliArgs)(argv);
    const handler =
      (_a = handlers[args.method]) !== null && _a !== void 0
        ? _a
        : callEndpoints;
    await handler(app, args);
    return 0;
  } catch (err) {
    app.logger.error(
      '❌ Error',
      err instanceof Error ? err.message : String(err),
    );
    return 1;
  }
}

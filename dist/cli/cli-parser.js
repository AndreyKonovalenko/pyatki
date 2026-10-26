'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.parseCliArgs = parseCliArgs;
const methods_1 = require('../domain/methods');
const methods_2 = require('./methods');
function parseCliArgs(argv) {
  const get = prefix => {
    const found = argv.find(a => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : '';
  };
  const method = get('--method=');
  const inn = get('--inn=');
  const year = get('--year=');
  if (!method) {
    throw new Error(
      `Missing --method=<name>\nAvailabe: ${methods_2.ALL_METHODS.join(', \n')}`,
    );
  }
  console.log(methods_2.ALL_METHODS);
  const args = { method, inn, year };
  (0, methods_1.validateArgs)(args, methods_2.ALL_METHODS);
  return args;
}

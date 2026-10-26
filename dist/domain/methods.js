'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.METHODS_WITH_YEAR = exports.METHODS_WITHOUT_INN = void 0;
exports.isValidInn = isValidInn;
exports.isValidYear = isValidYear;
exports.needsInn = needsInn;
exports.needsYear = needsYear;
exports.validateArgs = validateArgs;
exports.METHODS_WITHOUT_INN = ['check_balance'];
exports.METHODS_WITH_YEAR = ['get_company_financial_report'];
function isValidInn(inn) {
  return /^\d{10}$|^\d{12}$/.test(inn);
}
function isValidYear(year) {
  return /^(19\d{2}|20\d{2}|2100)$/.test(year);
}
function needsInn(method) {
  return !exports.METHODS_WITHOUT_INN.includes(method);
}
function needsYear(method) {
  return exports.METHODS_WITH_YEAR.includes(method);
}
function validateArgs(args, knownMethods) {
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

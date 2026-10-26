'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validEnv = validEnv;
exports.isValidInn = isValidInn;
function validEnv(name, variableName) {
  if (!name) {
    throw new Error(
      variableName
        ? `Missing evironment variable:${variableName}`
        : 'Missing required environment variable',
    );
  }
  return name;
}
function isValidInn(value) {
  const INN_PATTERN = /^\d{10}$|^\d{12}$/;
  return INN_PATTERN.test(value);
}

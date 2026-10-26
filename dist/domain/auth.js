'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.HttpError = exports.AuthenticationError = void 0;
exports.isLoginSuccessful = isLoginSuccessful;
function isLoginSuccessful(res) {
  var _a;
  return (
    ((_a = res === null || res === void 0 ? void 0 : res.status) === null ||
    _a === void 0
      ? void 0
      : _a.methodStatus) === 'Success'
  );
}
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationErrror';
  }
}
exports.AuthenticationError = AuthenticationError;
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}
exports.HttpError = HttpError;

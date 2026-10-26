'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ConsoleLogger = void 0;
class ConsoleLogger {
  debug(msg) {
    console.debug(msg);
  }
  info(msg) {
    console.log(msg);
  }
  warn(msg) {
    console.warn(msg);
  }
  error(msg, err) {
    console.error(msg, err !== null && err !== void 0 ? err : '');
  }
}
exports.ConsoleLogger = ConsoleLogger;

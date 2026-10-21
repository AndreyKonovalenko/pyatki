import type { Logger } from '../domain/prots';

export class ConsoleLogger implements Logger {
  debug(msg: string) {
    console.debug(msg);
  }
  info(msg: string) {
    console.log(msg);
  }
  warn(msg: string) {
    console.warn(msg);
  }
  error(msg: string, err?: unknown) {
    console.error(msg, err ?? '');
  }
}

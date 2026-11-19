import type { App } from '../app/create-app';

import type { QueryArgs } from '../models/methods';
import {
  methodDispatcher,
  type MethodDespatherResult,
} from '../infrastructure/method-dispatcher';

export async function rawMethodsController(
  app: App,
  args: QueryArgs,
): Promise<MethodDespatherResult[]> {
  return methodDispatcher(app, args);
}

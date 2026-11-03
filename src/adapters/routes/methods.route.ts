import type { RequestHandler } from "express";
import type { App } from "../../app";
import { ALL_METHODS } from "../../cli/methods";

export function methodsRoutes(_app: App): RequestHandler {
  return (_req, res) => {
   res.status(200).json(ALL_METHODS);
 };
}

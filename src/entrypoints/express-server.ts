import express, { Express } from 'express';
import path from 'path';
import type { App } from '../app/create-app';
import { rawMethodsController } from '../controllers/raw-methods.controller';
import { customMethodsController } from '../controllers/custom-methods.controller';
import { ALL_METHODS } from '../models/methods';
import { isCustomMethod } from '../models/methods';

export function createExpressServer(app: App): Express {
  const server = express();
  server.use(express.json());
  server.use(express.static(path.join(__dirname, '..', '..', 'public')));
  server.get('/status', (_req, res) => {
    res.status(200).send("Pyatki's server is fine!");
  });
  server.get('/api/methods', (_req, res) => {
    res.status(200).json(ALL_METHODS);
  });
  server.get('/api/', async (req, res) => {
    const { method, inn, year } = req.query as {
      method?: string;
      inn?: string;
      year?: string;
    };
    const args = {
      method: method ?? '',
      inn: inn ?? '',
      year: year ?? '',
    };
    try {
      const data = isCustomMethod(args.method)
        ? await customMethodsController(app, args)
        : await rawMethodsController(app, args);
      res.json({ method, data });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });
  return server;
}

import express, { Express } from 'express'
import path from 'path';
import type { App } from '../app'
import { executeRoute } from './routes/execute.route';
import { methodsRoutes } from './routes/methods.route';


export function createExpressServer(app: App): Express {
  const server = express();
  server.use(express.json()); 
  server.use(express.static(path.join(__dirname, '..','..', 'src', 'web')));
  server.get('/status', (_req, res) => {
   res.status(200).send("Pyatki's server is fine!");
  });
  server.get('/api/methods', methodsRoutes(app));
  server.get('/api/execute', executeRoute(app));
  return server;
};


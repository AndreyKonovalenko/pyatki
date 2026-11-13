import express, { Express } from 'express'
import path from 'path';
import type { App } from '../app/create-app'
import { rawDispatcherController } from '../controllers/raw-dispatchl.controller';
import { ALL_METHODS } from '../models/methods';


export function createExpressServer(app: App): Express {
  const server = express();
  server.use(express.json()); 
  server.use(express.static(path.join(__dirname, '..', '..', 'public')));
  server.get('/status', (_req, res) => {
   res.status(200).send("Pyatki's server is fine!");
  });
  server.get('/api/methods', (_req, res) =>{
    res.status(200).json(ALL_METHODS)
  });
  server.get('/api/raw', async(req, res) => {
    const {method, inn, year} = req.query as {
      method?: string,
      inn?: string,
      year?: string
    }
    try {
      const data = await rawDispatcherController(app, {method: method ?? '', inn: inn ?? '', year: year?? ''})
      res.json({method, data})
    } catch (err) {
      res.status(400).json({error: (err as Error).message})
    }
  });
  return server;
};


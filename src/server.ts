import { createApp } from './app/create-app';
import { createExpressServer } from './entrypoints/express-server';
import config from './config';

const app = createApp();
const { port, host } = config.server;
const server = createExpressServer(app);

server.listen(port, host, () => {
  const displayHost = host === '0.0.0.0' || host === '::' ? 'localhost' : host;
  app.logger.info(
    `🌐 Server listening on http://${displayHost}:${port} (bound to ${host}:${port})`,
  );
});

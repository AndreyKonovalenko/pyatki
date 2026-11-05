
import { createApp } from './app';
import { createExpressServer } from './adapters/express-server';

const app = createApp();
const {port, host} = app.config.server;
const server = createExpressServer(app);

server.listen(port, host, () => {
 const displayHost = host === '0.0.0.0' || host === '::' ? 'localhost' : host;
  app.logger.info(`🌐 Server listening on http://${displayHost}:${port} (bound to ${host}:${port})`);
});


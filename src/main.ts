import { createApp } from './app/create-app';
import { runCli } from './entrypoints/cli';

async function main() {
  const app = createApp();
  try {
    process.exit(await runCli(app, process.argv.slice(2)));
  } catch (err) {
    app.logger.error('❌ Fatal error', err);
    process.exit(1);
  }
}
main();

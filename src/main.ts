import { createApp } from './app';
import { runCli } from './cli/cli';

async function main() {
  const app = createApp();
  try {
    process.exit(await runCli(process.argv.slice(2), app));
  } catch (err) {
    app.logger.error('❌ Fatal error', err);
    process.exit(1);
  }
}

main();

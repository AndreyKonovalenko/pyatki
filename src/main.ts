import { authService } from './services/auth-service';
import { getCliArgs } from './cli/cli-parser';
import { METHOD_ENDPOINTS } from './cli/methods';

async function main() {
  try {
    const { method, inn } = getCliArgs();
    const endpoint = METHOD_ENDPOINTS[method];

    console.log(`🔍 Calling ${method}${inn ? ` for INN ${inn}` : ''}...`);

    await authService.authenticate();

    const result = await authService.get(endpoint, {
      params: inn ? { inn } : undefined,
    });

    console.log('✅ Result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
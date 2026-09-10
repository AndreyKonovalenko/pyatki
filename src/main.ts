import { authService } from './services/auth-service';
import { validEnv } from './utils/utils';
const CHECK_BALANCE = validEnv(process.env.CHECK_BALANCE);
const GET_COMPANY_CARD = validEnv(process.env.GET_COMPANY_CARD);

async function main() {
  console.log('Getting balace');
  const balance = await authService.get(CHECK_BALANCE);
  console.log('💰 Balance:', balance);

  console.log('Getting company card');
  const card = await authService.get(GET_COMPANY_CARD, {
    params: { inn:  },
  });
  console.log('Company card:', card.company_card);
}
main();

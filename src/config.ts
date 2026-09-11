import dotenv from 'dotenv';
import { validEnv } from './utils/utils';

const envFound = dotenv.config({ path: '.env' });

if (envFound.error) {
  throw new Error('no .env file found');
}

// process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  nodeEnv: process.env.NODE_ENV,
  auth:{
    username:validEnv(process.env.USERNAME),
    password:validEnv(process.env.PASSWORD),
    tokenName:validEnv(process.env.TOKEN_NAME)
  },
  endpoints:{
    baseURL: validEnv(process.env.BASE_URL),
    login: validEnv(process.env.LOGIN),
    check_balance: validEnv(process.env.CHECK_BALANCE),
    get_company_card: '/api/Rest/get_company_card',
    get_company_court_cases: '/api/Rest/get_company_court_cases',
    get_company_bailiffs: '/api/Rest/get_company_bailiffs',
    get_company_owners: '/api/Rest/get_company_owners',
    get_company_financial_report: '/api/Rest/get_company_financial_report',
    get_company_suppliers_blacklist: '/api/Rest/get_company_suppliers_blacklist',

  }
}
  

  
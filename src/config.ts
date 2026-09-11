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
    get_company_card: validEnv(process.env.GET_COMPANY_CARD),
    get_company_court_cases: validEnv(process.env.GET_COMPANY_COURT_CASES),
    get_company_bailiffs: validEnv(process.env.GET_COMPANY_BAILIFFS),
    get_company_owners: validEnv(process.env.GET_COMPANY_OWNERS),
    get_company_financial_report: validEnv(process.env.GET_COMPANY_FINANCIAL_REPORT),
    get_company_suppliers_blacklist: validEnv(process.env.GET_COMPANY_SUPPLIERS_BLACKLIST),
    get_court_cases_statistics: validEnv(process.env.GET_COURT_CASES_STATISTICS)
  }
}
  

  
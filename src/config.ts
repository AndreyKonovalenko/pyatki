import dotenv from 'dotenv';
import { validEnv } from './utils/utils';

const envFound = dotenv.config({ path: '.env' });

if (envFound.error) {
  throw new Error('no .env file found');
}

// process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  nodeEnv: process.env.NODE_ENV,
  auth: {
    username: validEnv(process.env.USERNAME),
    password: validEnv(process.env.PASSWORD),
    tokenName: validEnv(process.env.TOKEN_NAME),
  },
  endpoints: {
    baseURL: validEnv(process.env.BASE_URL),
    login: validEnv(process.env.LOGIN),
    check_balance: validEnv(process.env.CHECK_BALANCE, 'CHECK_BALANCE'),
    get_company_card: validEnv(
      process.env.GET_COMPANY_CARD,
      'GET_COMPANY_CARD',
    ),
    get_company_court_cases: validEnv(
      process.env.GET_COMPANY_COURT_CASES,
      'GET_COMPANY_COURT_CASES',
    ),
    get_company_bailiffs: validEnv(
      process.env.GET_COMPANY_BAILIFFS,
      'GET_COMPANY_BAILIFFS',
    ),
    get_company_owners: validEnv(
      process.env.GET_COMPANY_OWNERS,
      'GET_COMPANY_OWNERS',
    ),
    get_company_financial_report: validEnv(
      process.env.GET_COMPANY_FINANCIAL_REPORT,
      'GET_COMPANY_FINANCIAL_REPORT',
    ),
    get_company_suppliers_blacklist: validEnv(
      process.env.GET_COMPANY_SUPPLIERS_BLACKLIST,
      'GET_COMPANY_SUPPLIERS_BLACKLIST',
    ),
    get_entrepreneur_card: validEnv(
      process.env.GET_ENTERPRENEUR_CARD,
      'GET_ENTERPRENEUR_CARD',
    ),
    batch: {
      inputFilePath: validEnv(process.env.INPUT_FILE_PATH, 'INPUT_FILE_PATH'),
      outputFilePath: validEnv(
        process.env.OUTPUT_FILE_PATH,
        'OUTPUT_FILE_PATH',
      ),
      concurrency: Number(process.env.BATH_CONCURRENCY ?? 5),
    },
  },
};

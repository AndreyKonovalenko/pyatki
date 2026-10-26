'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv_1 = __importDefault(require('dotenv'));
const utils_1 = require('./utils/utils');
const envFound = dotenv_1.default.config({ path: '.env' });
if (envFound.error) {
  throw new Error('no .env file found');
}
// process.env.NODE_ENV = process.env.NODE_ENV || 'development';
exports.default = {
  nodeEnv: process.env.NODE_ENV,
  auth: {
    username: (0, utils_1.validEnv)(process.env.USERNAME),
    password: (0, utils_1.validEnv)(process.env.PASSWORD),
    tokenName: (0, utils_1.validEnv)(process.env.TOKEN_NAME),
  },
  endpoints: {
    baseURL: (0, utils_1.validEnv)(process.env.BASE_URL),
    login: (0, utils_1.validEnv)(process.env.LOGIN),
    check_balance: (0, utils_1.validEnv)(
      process.env.CHECK_BALANCE,
      'CHECK_BALANCE',
    ),
    get_company_card: (0, utils_1.validEnv)(
      process.env.GET_COMPANY_CARD,
      'GET_COMPANY_CARD',
    ),
    get_company_court_cases: (0, utils_1.validEnv)(
      process.env.GET_COMPANY_COURT_CASES,
      'GET_COMPANY_COURT_CASES',
    ),
    get_company_bailiffs: (0, utils_1.validEnv)(
      process.env.GET_COMPANY_BAILIFFS,
      'GET_COMPANY_BAILIFFS',
    ),
    get_company_owners: (0, utils_1.validEnv)(
      process.env.GET_COMPANY_OWNERS,
      'GET_COMPANY_OWNERS',
    ),
    get_company_financial_report: (0, utils_1.validEnv)(
      process.env.GET_COMPANY_FINANCIAL_REPORT,
      'GET_COMPANY_FINANCIAL_REPORT',
    ),
    get_company_suppliers_blacklist: (0, utils_1.validEnv)(
      process.env.GET_COMPANY_SUPPLIERS_BLACKLIST,
      'GET_COMPANY_SUPPLIERS_BLACKLIST',
    ),
    get_entrepreneur_card: (0, utils_1.validEnv)(
      process.env.GET_ENTERPRENEUR_CARD,
      'GET_ENTERPRENEUR_CARD',
    ),
  },
};

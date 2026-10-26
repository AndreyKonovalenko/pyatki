'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ALL_METHODS =
  exports.METHOD_ENDPOINTS =
  exports.CUSTOM_METHODS =
    void 0;
const config_1 = __importDefault(require('../config'));
const { endpoints } = config_1.default;
exports.CUSTOM_METHODS = {
  company_overview: 'company_overview',
};
exports.METHOD_ENDPOINTS = {
  check_balance: endpoints.check_balance,
  get_company_card: endpoints.get_company_card,
  get_company_court_cases: endpoints.get_company_court_cases,
  get_company_bailiffs: endpoints.get_company_bailiffs,
  get_company_owners: endpoints.get_company_owners,
  get_company_financial_report: endpoints.get_company_financial_report,
  get_company_suppliers_blacklist: endpoints.get_company_suppliers_blacklist,
  get_entrepreneur_card: endpoints.get_entrepreneur_card,
};
exports.ALL_METHODS = [
  ...Object.keys(exports.METHOD_ENDPOINTS),
  ...Object.values(exports.CUSTOM_METHODS),
];

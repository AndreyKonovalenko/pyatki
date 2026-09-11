import config from "../config";
const {endpoints}= config;

export const METHOD_ENDPOINTS: Record<string, string> = {
  check_balance: endpoints.check_balance,
  get_company_card: endpoints.get_company_card,
  get_company_court_cases: endpoints.get_company_court_cases,
  get_company_bailiffs: endpoints.get_company_bailiffs,
  get_company_owners: endpoints.get_company_owners,
  get_company_financial_report: endpoints.get_company_financial_report,
  get_company_suppliers_blacklist: endpoints.get_company_suppliers_blacklist,
};

export const METHODS_WITHOUT_INN = ['check_balance'];
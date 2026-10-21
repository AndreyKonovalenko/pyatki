import config from '../config';
const { endpoints } = config;

export const CUSTOM_METHODS = {
  company_overview: 'company_overview',
};

export const METHOD_ENDPOINTS: Record<string, string> = {
  check_balance: endpoints.check_balance,
  get_company_card: endpoints.get_company_card,
  get_company_court_cases: endpoints.get_company_court_cases,
  get_company_bailiffs: endpoints.get_company_bailiffs,
  get_company_owners: endpoints.get_company_owners,
  get_company_financial_report: endpoints.get_company_financial_report,
  get_company_suppliers_blacklist: endpoints.get_company_suppliers_blacklist,
  get_entrepreneur_card: endpoints.get_entrepreneur_card,
};

export const ALL_METHODS = [
  ...Object.keys(METHOD_ENDPOINTS),
  ...Object.values(CUSTOM_METHODS),
];

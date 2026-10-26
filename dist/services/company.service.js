'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CompanyService = void 0;
const company_card_mapper_1 = require('../adapters/company/company-card.mapper');
const config_1 = __importDefault(require('../config'));
class CompanyService {
  constructor(http) {
    this.http = http;
  }
  async getCard(inn) {
    const dto = await this.http.get(
      config_1.default.endpoints.get_company_card,
      { params: { inn } },
    );
    return (0, company_card_mapper_1.toCompanyCard)(dto);
  }
}
exports.CompanyService = CompanyService;

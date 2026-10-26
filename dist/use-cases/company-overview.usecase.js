'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CompanyOverviewUseCase = void 0;
class CompanyOverviewUseCase {
  constructor(company, logger) {
    this.company = company;
    this.logger = logger;
  }
  async run(inn) {
    this.logger.info(`🔍 Scoring company ${inn}...`);
    const [card] = await Promise.all([this.company.getCard(inn)]);
    return {
      shortName: card.shortName,
      status: card.status.label,
    };
  }
}
exports.CompanyOverviewUseCase = CompanyOverviewUseCase;

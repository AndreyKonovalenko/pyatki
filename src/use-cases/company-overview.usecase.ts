import type { Logger } from '../models/ports';
import type { CompanyApiClient } from '../infrastructure/company-api.client';
import type { CompanyOverviewResult } from '../models/company.model';

export class CompanyOverviewUseCase {
  constructor(
    private company: CompanyApiClient,
    private logger: Logger,
  ) {}

  async run(inn: string): Promise<CompanyOverviewResult> {
    this.logger.info(`🔍 Scoring company ${inn}...`);
    const [card] = await Promise.all([this.company.getCard(inn)]);
    return {
      shortName: card.shortName,
      status: card.status.label,
    };
  }
}

// for future logic of multiple api calls

// const [card, score] = await Promise.all([
//   this.company.getCard(inn),
//   this.scoring.score(inn),
// ]);

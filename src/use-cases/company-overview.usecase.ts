import { Logger } from '../domain/prots';
import { CompanyService } from '../services/company.service';

export interface OverviewData {
  shortName: string;
  status: string;
}

export class CompanyOverviewUseCase {
  constructor(
    private company: CompanyService,
    private logger: Logger,
  ) {}

  async run(inn: string): Promise<OverviewData> {
    this.logger.info(`🔍 Scoring company ${inn}...`);

    const [card] = await Promise.all([this.company.getCard(inn)]);

    return {
      shortName: card.shortName,
      status: card.status.label,
    };
  }
}

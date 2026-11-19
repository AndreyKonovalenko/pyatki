import type { ApiService } from '../services/api.service';
import { CompanyCard } from '../models/company.model';
import type { CompanyCardResponseDto } from './company-card.dto';
import { toCompanyCard } from './company-card.mapper';

export class CompanyApiClient {
  constructor(
    private api: ApiService,
    private endpoints: { getCard: string },
  ) {}

  async getCard(inn: string): Promise<CompanyCard> {
    const dto = await this.api.get<CompanyCardResponseDto>(
      this.endpoints.getCard,
      { params: { inn } },
    );
    return toCompanyCard(dto);
  }
}

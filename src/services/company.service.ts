import type { HttpCleint } from '../domain/prots';
import type { CompanyCard } from '../domain/company';
import type { CompanyCardResponseDto } from '../adapters/company/company-card.dto';
import { toCompanyCard } from '../adapters/company/company-card.mapper';
import config from '../config';

export class CompanyService {
  constructor(private http: HttpCleint) {}
  async getCard(inn: string): Promise<CompanyCard> {
    const dto = await this.http.get<CompanyCardResponseDto>(
      config.endpoints.get_company_card,
      { params: { inn } },
    );
    return toCompanyCard(dto);
  }
}

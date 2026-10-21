// import type { HttpCleint } from "../domain/prots";
// import type {CompanyCard} from '../domian/company'

// import config from "../config";

// export class CompanyService {
//   constructor(private http: HttpCleint) {
//   }

//   async getCard(inn: string): Promise<ComponyCard> {
//     const dto = await this.http.get<CompanyCardDto>(
//       config.endpoints.get_company_card,
//       {params: {inn}}
//     );
//     return toCompanyCard(dto)
//   }

// }

import { Logger } from "../domain/prots"
import { CompanyService } from "../services/company.service"

export class CompanyOverviewUseCase {
  constructor (
    private company: CompanyService,
    private logger: Logger,
  ){}

  async run(inn: string ):Promise<string> {
    this.logger.info(`🔍 Scoring company ${inn}...`)

    const [card] = await Promise.all([
      this.company.getCard(inn)
    ])

    return `${card.shortName} ${card.inn} ${card.status.label}`

  }
}
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Company } from 'src/entities/Company'
import { Repository } from 'typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'
import { GqlService } from 'src/gql/gql.service'
import { gql } from 'graphql-request'

const listCompaniesQuery = gql`
  query CompaniesQuery {
    companies(first: 500) {
      id
      displayNameCompany
      equalityScore
      fairPayScore
      climateScore
      antiWeaponsScore
      animalScore
      natureScore
      antiTaxAvoidanceScore
    }
  }
`

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companiesRepo: Repository<Company>,
    private gqlService: GqlService,
  ) {}

  public async list() {
    return this.companiesRepo.find({ take: 20 })
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async syncCompaniesFromCrm() {
    console.log('SYNCING COMPANIES START')
    console.time('SYNCING COMPANIES')
    const res = await this.gqlService.client.request(listCompaniesQuery)
    for (const company of res.companies) {
      await this.companiesRepo.save({
        id: company.id,
        display_name_company: company.displayNameCompany,
        equality_score: company.equalityScore,
        fair_pay_score: company.fairPayScore,
        climate_score: company.climateScore,
        anti_weapons_score: company.antiWeaponsScore,
        animal_score: company.animalScore,
        nature_score: company.natureScore,
        anti_tax_avoidance_score: company.antiTaxAvoidanceScore,
      })
    }
    console.timeEnd('SYNCING COMPANIES')
  }
}

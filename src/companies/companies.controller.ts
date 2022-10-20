import { Controller, Get, Post } from '@nestjs/common'
import { CompaniesService } from './companies.service'

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  async list() {
    return this.companiesService.list()
  }

  @Post('sync')
  async syncNow() {
    await this.companiesService.syncCompaniesFromCrm()
    return { done: true }
  }
}

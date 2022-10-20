import { Controller, Get } from '@nestjs/common'

@Controller('users/:userId/companies')
export class CompaniesController {
  @Get()
  async list() {
    return { status: 'ok' }
  }
}

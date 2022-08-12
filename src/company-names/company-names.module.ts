import { Module } from '@nestjs/common'
import { CompanyNamesController } from './company-names.controller'

@Module({
  controllers: [CompanyNamesController],
})
export class CompanyNamesModule {}

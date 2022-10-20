import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from 'src/entities/Company'
import { GqlModule } from 'src/gql/gql.module'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'

@Module({
  imports: [TypeOrmModule.forFeature([Company]), GqlModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}

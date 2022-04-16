import { Module } from '@nestjs/common'
import { MerchantsController } from './merchants.controller'
import { MerchantsService } from './merchants.service'
import { CategoriesModule } from './categories/categories.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Merchant } from 'src/entities/Merchant'
import { AccountsModule } from './accounts/accounts.module'
import { PatternsModule } from './patterns/patterns.module'

@Module({
  controllers: [MerchantsController],
  providers: [MerchantsService],
  imports: [TypeOrmModule.forFeature([Merchant]), CategoriesModule, AccountsModule, PatternsModule],
})
export class MerchantsModule {}

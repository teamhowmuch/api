import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Merchant } from 'src/entities/Merchant'
import { MerchantCategory } from 'src/entities/MerchantCategory'

import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, MerchantCategory])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

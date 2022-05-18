import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MerchantTransactionSearchPattern } from 'src/entities/MerchantTransactionSearchPattern'
import { PatternsController } from './patterns.controller'
import { PatternsService } from './patterns.service'

@Module({
  controllers: [PatternsController],
  providers: [PatternsService],
  exports: [PatternsService],
  imports: [TypeOrmModule.forFeature([MerchantTransactionSearchPattern])],
})
export class PatternsModule {}

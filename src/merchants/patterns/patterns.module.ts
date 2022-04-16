import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MerchantPattern } from 'src/entities/MerchantPattern'
import { PatternsController } from './patterns.controller'
import { PatternsService } from './patterns.service'

@Module({
  controllers: [PatternsController],
  providers: [PatternsService],
  imports: [TypeOrmModule.forFeature([MerchantPattern])],
})
export class PatternsModule {}

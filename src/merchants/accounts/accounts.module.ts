import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MerchantAccount } from 'src/entities/MerchantAccount'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [TypeOrmModule.forFeature([MerchantAccount])],
})
export class AccountsModule {}

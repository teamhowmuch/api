import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MerchantBankAccount } from 'src/entities/MerchantBankAccount'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [TypeOrmModule.forFeature([MerchantBankAccount])],
})
export class AccountsModule {}

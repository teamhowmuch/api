import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/entities/Transaction'
import { UserBankConnection } from 'src/entities/UserBankConnection'
import { Bank } from 'src/entities/Bank'
import { UsersModule } from 'src/users/users.module'
import { BankConnectionsController } from './bank-connections.controller'
import { BankConnectionsService } from './bank-connections.service'
import { NordigenService } from './nordigen.service'
import { BanksService } from './banks.service'
import { ScheduleModule } from '@nestjs/schedule'
import { BanksController } from './banks.controller'
import { TinkService } from './tink.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBankConnection, Transaction, Bank]),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  controllers: [BankConnectionsController, BanksController],
  providers: [BankConnectionsService, NordigenService, BanksService, TinkService],
  exports: [BankConnectionsService, NordigenService],
})
export class BankConnectionsModule {}

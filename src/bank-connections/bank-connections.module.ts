import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entity/Transaction';
import { UserBankConnection } from 'src/entity/UserBankConnection';
import { UsersModule } from 'src/users/users.module';
import { BankConnectionsController } from './bank-connections.controller';
import { BankConnectionsService } from './bank-connections.service';
import { NordigenService } from './nordigen.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBankConnection, Transaction]), UsersModule],
  controllers: [BankConnectionsController],
  providers: [BankConnectionsService, NordigenService],
  exports: [BankConnectionsService, NordigenService],
})
export class BankConnectionsModule {}

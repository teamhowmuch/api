import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBankConnection } from 'src/entity/UserBankConnection';
import { UsersModule } from 'src/users/users.module';
import { BankConnectionsController } from './bank-connections.controller';
import { BankConnectionsService } from './bank-connections.service';
import { NordigenService } from './nordigen.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBankConnection]), UsersModule],
  controllers: [BankConnectionsController],
  providers: [BankConnectionsService, NordigenService]
})
export class BankConnectionsModule {}

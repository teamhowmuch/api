import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { BullModule } from '@nestjs/bull'
import { StructureProcessor } from './clean.processor'
import { flatList } from '../queues'
import { CleanService } from './clean.service'
import { ImportController } from './transactions.controller'
import { BankConnectionsModule } from 'src/bank-connections/bank-connections.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/entities/Transaction'
import { CategoriseProcessor } from './categorise.processor'
import { ConfirmationService } from './confirmation.service'
import { TransactionConfirmation } from 'src/entities/TransactionConfirmation'
import { ConfirmationsController } from './confirmations.controller'

@Module({
  imports: [
    BullModule.registerQueue(...flatList.map((name) => ({ name }))),
    BankConnectionsModule,
    TypeOrmModule.forFeature([Transaction, TransactionConfirmation]),
  ],
  providers: [
    ConfirmationService,
    TransactionsService,
    StructureProcessor,
    CategoriseProcessor,
    CleanService,
  ],
  controllers: [ImportController, ConfirmationsController],
  exports: [ConfirmationService],
})
export class TransactionModule {}

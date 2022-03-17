import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { BullModule } from '@nestjs/bull'
import { TransactionProcessor } from './transaction.processor'
import { flatList } from '../queues'
import { CleanService } from './clean.service'
import { ImportController } from './transactions.controller'
import { BankConnectionsModule } from 'src/bank-connections/bank-connections.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/entities/Transaction'

// import { ConfirmationService } from './confirmation.service'
// import { ConfirmationsController } from './confirmations.controller'

import { UsersModule } from 'src/users/users.module'
import { ProductsModule } from 'src/products/products.module'
import { EmissionEventsModule } from 'src/emission-events/emission-events.module'

@Module({
  imports: [
    BullModule.registerQueue(...flatList.map((name) => ({ name }))),
    BankConnectionsModule,
    UsersModule,
    ProductsModule,
    EmissionEventsModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  providers: [
    // ConfirmationService,
    TransactionsService,
    TransactionProcessor,
    CleanService,
  ],
  controllers: [ImportController],
  exports: [],
})
export class TransactionModule {}

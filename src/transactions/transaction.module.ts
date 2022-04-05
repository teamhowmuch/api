import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TransactionProcessor } from './transactionProcessor.service'
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
import { CarsModule } from 'src/cars/cars.module'

@Module({
  imports: [
    BankConnectionsModule,
    UsersModule,
    ProductsModule,
    EmissionEventsModule,
    CarsModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  providers: [TransactionsService, TransactionProcessor, CleanService],
  controllers: [ImportController],
  exports: [],
})
export class TransactionModule {}

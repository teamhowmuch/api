import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TransactionProcessor } from './transactionProcessor.service'
import { ImportController } from './transactions.controller'
import { BankConnectionsModule } from 'src/bank-connections/bank-connections.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/entities/Transaction'
import { UsersModule } from 'src/users/users.module'
import { ProductsModule } from 'src/products/products.module'
import { EmissionEventsModule } from 'src/emission-events/emission-events.module'
import { CarsModule } from 'src/cars/cars.module'
import { BankImport } from 'src/entities/BankImport'

@Module({
  imports: [
    BankConnectionsModule,
    UsersModule,
    ProductsModule,
    EmissionEventsModule,
    CarsModule,
    TypeOrmModule.forFeature([Transaction, BankImport]),
  ],
  providers: [TransactionsService, TransactionProcessor],
  controllers: [ImportController],
  exports: [],
})
export class TransactionModule {}

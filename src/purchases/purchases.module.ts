import { Module } from '@nestjs/common'
import { TransactionModule } from 'src/transactions/transaction.module'
import { TransactionsService } from 'src/transactions/transactions.service'
import { FromTransactionsProcessor } from './fromTransactions.processor'

@Module({
  providers: [FromTransactionsProcessor],
  imports: [TransactionModule],
})
export class PurchasesModule {}

import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BullModule } from '@nestjs/bull';
import { ClassifyProcessor } from './classify.processor';
import { queues } from '../queue-names';
import { ClassifyService } from './classify.service';
import { ImportController } from './transactions.controller';
import { BankConnectionsModule } from 'src/bank-connections/bank-connections.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: queues.transactions }),
    BullModule.registerQueue({ name: queues.enrichedTransactions }),
    BankConnectionsModule,
  ],
  providers: [TransactionsService, ClassifyProcessor, ClassifyService],
  controllers: [ImportController],
})
export class TransactionModule {}

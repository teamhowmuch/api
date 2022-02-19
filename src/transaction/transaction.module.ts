import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { BullModule } from '@nestjs/bull';
import { ClassifyProcessor } from './classify.processor';
import { queues } from '../queue-names';
import { ClassifyService } from './classify.service';
import { ImportController } from './import.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: queues.transactions }),
    BullModule.registerQueue({ name: queues.enrichedTransactions }),
  ],
  providers: [ImportService, ClassifyProcessor, ClassifyService],
  controllers: [ImportController],
})
export class TransactionModule {}

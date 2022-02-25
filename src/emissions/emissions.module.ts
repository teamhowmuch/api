import { Module } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { EmissionsProcessor } from './emissions.processor';
import { BullModule } from '@nestjs/bull';
import { queues } from '../queue-names';


@Module({
  imports: [
    BullModule.registerQueue({ name: queues.transactions }),
    BullModule.registerQueue({ name: queues.enrichedTransactions }),
    BullModule.registerQueue({ name: queues.emissifiedTransactions}),
  ],
  providers: [EmissionsService, EmissionsProcessor]
})

export class EmissionsModule {


}

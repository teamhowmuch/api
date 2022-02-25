import { queues } from '../queue-names';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
//import { Transaction } from '../bank-connections/models/transaction';
import { EnrichedTransaction } from '../transaction/models/enriched-transaction';
import { Job, Queue } from 'bull';
import { EmissionsService } from './emissions.service';

@Processor(queues.enrichedTransactions)

export class EmissionsProcessor {
  constructor(@InjectQueue(queues.emissifiedTransactions) private emissifiedQueue: Queue, private emissionsService: EmissionsService) {}

  @Process()
  async emissifyTransaction(job: Job<EnrichedTransaction>) {
    const emissified = await this.emissionsService.emissify(job.data);
    console.log(`logging emissified: ${JSON.stringify(emissified)}`);
    this.emissifiedQueue.add(emissified);
  }
}
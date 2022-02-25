import { queues } from '../queue-names';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Transaction } from '../bank-connections/models/transaction';
import { Job, Queue } from 'bull';
import { ClassifyService } from './classify.service';

@Processor(queues.transactions)
export class ClassifyProcessor {
  constructor(@InjectQueue(queues.enrichedTransactions) private enrichedQueue: Queue, private classifyService: ClassifyService) {}

  @Process()
  async classifyTransaction(job: Job<Transaction>) {
    const enriched = await this.classifyService.classify(job.data);
    //if (enriched) {
      console.log('in processing classified transaction');
      console.log(enriched);
      this.enrichedQueue.add(enriched);
    //}
  }
}

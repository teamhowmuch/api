import { Injectable } from '@nestjs/common';
import { queues } from '../queue-names';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Transaction } from '../bank-connections/models/transaction';

@Injectable()
export class ImportService {
  constructor(
    @InjectQueue(queues.transactions) private transactionQueue: Queue,
  ) {}

  addToQueue() {
    this.transactionQueue.add({ foo: 'bar' });
  }
}

import { Injectable } from '@nestjs/common';
import { queues } from '../queue-names';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { BankConnectionsService } from 'src/bank-connections/bank-connections.service';
import { Transaction } from 'src/bank-connections/models/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectQueue(queues.transactions) private transactionQueue: Queue,
    private bankConnectionService: BankConnectionsService,
  ) {}

  addToQueue() {
    this.transactionQueue.add({ foo: 'bar' });
  }

  async importTransactions(userId: number) {
    console.log("In importing transactions service");

    const connections = await this.bankConnectionService.listBankConnections(
      userId,
    );

    console.log(connections);

    const transactions: Transaction[] = [];

    for (const connection of connections) {
      const res = await this.bankConnectionService.getTransactions(
        connection.id,
        userId,
      );

      transactions.push(...res);
    }

    for (const transaction of transactions) {
      await this.transactionQueue.add(transaction);
    }
    console.log(await this.transactionQueue.getJobCounts());

    return true;
  }

  async testMethod() {
    const job = this.addToQueue();
    const x = await this.transactionQueue.getNextJob()
    console.log(x)
    return true
  }
}

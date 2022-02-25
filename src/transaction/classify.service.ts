import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Transaction } from '../bank-connections/models/transaction';
import { EnrichedTransaction } from './models/enriched-transaction';

@Injectable()
export class ClassifyService {
  async classify(data: Transaction): Promise<EnrichedTransaction> {
    console.log("classifying transaction");
    console.log(data);
    return data;
  }
}

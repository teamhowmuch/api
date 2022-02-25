import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Transaction } from '../bank-connections/models/transaction';
import { EnrichedTransaction } from './models/enriched-transaction';

@Injectable()
export class ClassifyService {

  async classify(data: Transaction): Promise<EnrichedTransaction> {
      let enrichedTransaction: EnrichedTransaction;
      console.log("classifying transaction");
      console.log(data);

      if (data.transactionAmount.amount < 0) {
        console.log("recognized spend transaction. Inferring category");
        if (data.remittanceInformationUnstructured.includes('Cof') ) {
          console.log('Inferrend Coffee expenditure, adding label')
          enrichedTransaction = {
            ...data,
            classificationLabel: 'fuel'
          }
        }
      } else {
        console.log("Amount was higher than 0 so assuming this is not a payment. Ignoring for now");
      }
    return enrichedTransaction;
  }
}

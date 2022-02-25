import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Transaction } from '../bank-connections/models/transaction';
import { EnrichedTransaction } from './models/enriched-transaction';

@Injectable()
export class ClassifyService {
  async classify(data: Transaction): Promise<EnrichedTransaction> {
    let promise = new Promise<EnrichedTransaction>( (resolve,reject) => {
      console.log("classifying transaction");
      console.log(data);
      if (data.transactionAmount.amount < 0) {
        console.log("recognized spend transaction. Inferring category");
        if (data.remittanceInformationUnstructured.includes('Cof') ) {
          console.log('Inferrend Coffee expenditure, adding label')
          //add label
          resolve( {
            additionalInformation : data.additionalInformation,
            transactionId : data.transactionId,
            transactionAmount: {
              currency : data.transactionAmount.currency,
              amount: data.transactionAmount.amount,
            },
            bankTransactionCode : data.bankTransactionCode,
            bookingDate : data.bookingDate,
            valueDate : data.valueDate,
            creditorName : data.creditorName,
            remittanceInformationUnstructured : data.remittanceInformationUnstructured,
            classificationLabel: 'fuel'
          } )
        }
      } else {
        console.log("Amount was higher than 0 so assuming this is not a payment. Ignoring for now");
        reject("not a payment")
      }
    });
    
    return promise;
  }
}

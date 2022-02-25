import { Injectable } from '@nestjs/common';
//import { Transaction } from '../bank-connections/models/transaction';
import { EnrichedTransaction } from '../transaction/models/enriched-transaction';
import { EmissifiedTransaction } from './models/emissified-transaction';

@Injectable()
export class EmissionsService {

    emissify(data: EnrichedTransaction): Promise<EmissifiedTransaction>{
        //let emissifiedTransaction = {name: 'test', 'id': 5};
        let promise = new Promise<EmissifiedTransaction>((resolve,reject) => {
            if (data.transactionId) {       //dummy check
                //resolve({'name':'test'});   //dummy resolver
                let amount = Math.abs(data.transactionAmount.amount); //dummy clause. amounts that are spend are negative in the bank transactions
                //assuming it's all fuel category here
                let fuelInLiters = this.ConvertFuelExpenditureToLiters(amount); //should add the amount here
                //assuming user drives gasoline
                let emissionsforFuel = this.CalculateEmissionsForFuel(fuelInLiters,'gasoline');
                
                let emissifiedData: EmissifiedTransaction = { //I have the feeling this can be done much more efficiently: exend object with extra data to make it fit new interface
                    ...data,
                    emissions : emissionsforFuel,
                };
                resolve(emissifiedData);
            } else {
                reject('transaction does not contain transaction id') //dummy reason
            }
        });
        return promise;
    }

    DetermineAdditionalInformation(expenditureCategory: string){
        //input: expenditure category
        //array of if loop and in it for each cateogry the additional information that can/should be asked to user
        //return: an array of information
        
        //not fully implemented

        let additionalInformation: string[];

        if (expenditureCategory=="fuel") {
            additionalInformation.push('fuelType')
        }

        return additionalInformation;
    }

    ConvertFuelExpenditureToLiters(fuelExpenditure: number) {
        //input money amount of fuel
        //divide by price. For now: hardcoded price estimates
        //output: fuel in liters

        //should be extended with fuel type as additional input
        //and perhaps just merge with calculateEmissionsForFuel function

        let fuelInLiters: number;
        const fuelPricePerLiter = 1.95; //hardcoded dummy value
        fuelInLiters = Math.round(fuelExpenditure / fuelPricePerLiter); //determine later on how to round
        
        return fuelInLiters;
    }

    CalculateEmissionsForFuel(fuelInLiters: number, fuelType: string) {
        //input: Fuel in liters
        let EmissionsPerLiterFuel: number;
        if (fuelType == 'diesel') {
            EmissionsPerLiterFuel = 5; //dummy value
        } else if (fuelType == 'gasoline') {
            EmissionsPerLiterFuel = 3; //dummy value
        }
        return fuelInLiters * EmissionsPerLiterFuel;
    }

}
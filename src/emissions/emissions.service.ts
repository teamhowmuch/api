import { Injectable } from '@nestjs/common';
import { Transaction } from '../bank-connections/models/transaction';
import { EmissifiedTransaction } from './models/emissified-transaction';

@Injectable()
export class EmissionsService {

    emissify(data: Transaction): Promise<EmissifiedTransaction>{
        //let emissifiedTransaction = {name: 'test', 'id': 5};
        let promise = new Promise((resolve,reject) => {
            if (data.transactionId) {       //dummy check
                resolve({'name':'test'});   //dummy resolver
            } else {
                reject('transaction does not contain transaction id') //dummy reason
            }
        });
        return promise;
    }

    GetInfoFromExpenditure(){
        //not sure if this is needed
        //get the expenditure/transaction object from somewhere / the queue
        //get the required info
    }

    DetermineAdditionalInformation(expenditureCategory: string){
        //input: expenditure category
        //array of if loop and in it for each cateogry the additional information that can/should be asked to user
        //return: an array of information
        
        let additionalInformation: string[];

        if (expenditureCategory=="fuel") {
            additionalInformation.push('fuelType')
        }

        return additionalInformation;
    }

    ConvertFuelExpenditureToLiters(fuelExpenditure: number) {
        let fuelInLiters;
        const fuelPricePerLiter = 1.95;
        fuelInLiters = fuelExpenditure / fuelPricePerLiter;
        //input money amount of fuel
        //divide by price. For now: hardcoded price estimate
        //output: fuel in liters
        return fuelInLiters;
    }

    CalculateEmissionsForFuel(fuelInLiters: number, fuelType: string) {
        //input: Fuel in liters
        let EmissionsPerLiterFuel: number;
        if (fuelType == 'diesel') {
            EmissionsPerLiterFuel = 5;
        } else if (fuelType == 'gasoline') {
            EmissionsPerLiterFuel = 3;
        }
        return fuelInLiters * EmissionsPerLiterFuel;
    }

}

/** 
functie1: "determine_if_additional_input_required"
    input1: json file met transaction data
    input2:/dependency injection: data in onze database die al bekend is van de user, zoals of die diesel of benzine rijdt
    input3: json file met info die we voor category "fuel" nodig hebben om te bepalen of we alle informatie hebben
    
    (wat doen we als 1 van de 3 inputs ontbreekt?)
    
    vergelijk inhoud in input1 en input2 met input3
output: json object met inpout die nog ontbreekt (True or False) en if True, doorsturen naar die informatie aan de gebruiker vragen
*/ 

/** Voorbeeld van een binnenkomende transactie / input1 
Transaction {
    transactionId: 628234309835;
    transactionAmount: {
      currency: euro;
      amount: 15;
    };
    bankTransactionCode: eenofanderestring;
    bookingDate: Date;
    valueDate: Date;
    remittanceInformationUnstructured: string; /** ??? 
  }
*/ 

  /** Voorbeeld van data in onze database / input2 
  Userservice {
      userId: number;
      ...:
      ...:
      energytype: category;
  }

  Neededinfo {
      transactionamount;
  }

  */
import { Injectable } from '@nestjs/common';

@Injectable()
export class DetermineEmissionsService {}

/** 
functie1: "determine_if_additional_input_required"
    input1: json file met transaction data
    input2:/dependency injection: data in onze database die al bekend is van de user, zoals of die diesel of benzine rijdt
    input3: json file met info die we voor category "fuel" nodig hebben om te bepalen of we alle informatie hebben
    
    (wat doen we als 1 van de 3 inputs ontbreekt?)
    
    vergelijk inhoud in input1 en input2 met input3
output: json object met inpout die nog ontbreekt (True or False) en if True, doorsturen naar die informatie aan de gebruiker vragen
*/ 

/** Voorbeeld van een binnenkomende transactie / input1 */
Transaction {
    transactionId: 628234309835;
    transactionAmount: {
      currency: euro;
      amount: 15;
    };
    bankTransactionCode: eenofanderestring;
    bookingDate: Date;
    valueDate: Date;
    remittanceInformationUnstructured: string; /** ??? */
  }

  /** Voorbeeld van data in onze database / input2 */
  Userservice {
      userId: number;
      ...:
      ...:
      energytype: category;
  }

  Neededinfo {
      transactionamount;
  }
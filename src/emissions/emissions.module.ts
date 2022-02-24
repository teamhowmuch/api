import { Module } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { EmissionsProcessor } from './emissions.processor';

@Module({
  providers: [EmissionsService, EmissionsProcessor]
})

export class EmissionsModule {

// here subscribe to queue ? 

// expenditureCategory = .. from input Expenditure

// instantiate user object from User.... 

// let fuelType = 
// if fuelType is known from User profile, then fuelType = user.fuelType
// else: DetermineAdditionalInformation(expenditureCategory) //not for now

// let FuelInLiters: number = EmissionsService.convertFuelExpenditureToLiters(fuelExpenditure)

// let emissionsForFuelInLiters: number =  EmissionsService.calculateEmissionsForFuel(fuelInLiters,fuelType)

// let emissionsForExpenditure: number = emissionsForFuelInLiters;

// return emissionsForExpenditure; // label (raw or validated)

}

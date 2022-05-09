import { IsNumber, IsEnum, IsString, Length, IsOptional, IsDateString } from 'class-validator'

export enum FlightFare {
  ECONOMY = 'ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

export class CreateFlightDto {
  @IsString()
  @Length(3, 3)
  from_airport_id: string

  @IsString()
  @Length(3, 3)
  to_airport_id: string

  @IsDateString()
  purchased_at: Date

  @IsEnum(FlightFare)
  fare: FlightFare

  @IsNumber()
  ticket_count: number

  @IsNumber()
  @IsOptional()
  merchant_id: number

  @IsNumber()
  @IsOptional()
  amount_paid_eur: number
}

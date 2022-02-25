import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsNotEmpty()
  @IsString()
  bankId: string;

  @IsNotEmpty()
  @IsNumber()
  transaction_days_total: number;
}

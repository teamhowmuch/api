import { IsNotEmpty, IsString } from 'class-validator'

export class CreateConnectionDto {
  @IsNotEmpty()
  @IsString()
  bank_id: string

  @IsNotEmpty()
  @IsString()
  redirect_url: string
}

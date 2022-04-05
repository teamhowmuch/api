import { IsNotEmpty, IsString } from 'class-validator'

export class CreateConnectionDto {
  @IsNotEmpty()
  @IsString()
  bankId: string
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRedirectDto {
  @IsNotEmpty()
  @IsString()
  bankId: string;
}

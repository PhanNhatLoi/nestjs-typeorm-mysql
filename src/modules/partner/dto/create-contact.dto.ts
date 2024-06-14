import { IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;
  @IsString()
  @IsPhoneNumber()
  phone: string;
  @IsString()
  note: string;
  @IsNumber()
  toUserId: number;
}

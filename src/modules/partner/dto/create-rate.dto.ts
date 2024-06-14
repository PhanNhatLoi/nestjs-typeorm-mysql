import { IsNumber, IsString } from 'class-validator';

export class CreateRateDto {
  @IsNumber()
  toUserId: number;
  @IsString()
  content: string;
  @IsNumber()
  value: number;
}

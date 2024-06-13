import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRateDto {
  @IsOptional()
  @IsString()
  content: string;
  @IsOptional()
  @IsNumber()
  value: number;
}

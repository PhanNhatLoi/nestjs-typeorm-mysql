import {
  IsDate,
  IsDateString,
  IsEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export class CreateDiscountDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  imageUrl: string;
  @IsNumber()
  userId: number;
  @IsDateString()
  expiresTime: Date;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsEmpty()
  isDeleted;
  modifiedBy: DeepPartial<UserAccount>;
  createdBy: DeepPartial<UserAccount>;
}

import { IsDateString, IsEmpty, IsOptional, IsString } from 'class-validator';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export class UpdateDiscountDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  imageUrl: string;
  @IsOptional()
  @IsDateString()
  expiresTime: Date;
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsEmpty()
  isDeleted;
  @IsEmpty()
  userId;

  modifiedBy: DeepPartial<UserAccount>;
  createdBy: DeepPartial<UserAccount>;
}

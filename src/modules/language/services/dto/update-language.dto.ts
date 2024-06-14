import { IsEmpty, IsOptional, IsString } from 'class-validator';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export class UpdateLanguageDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sortName: string;
  @IsString()
  @IsOptional()
  dataSource?: JSON;
  @IsEmpty()
  isDeleted;

  modifiedBy: DeepPartial<UserAccount>;
  createdBy: DeepPartial<UserAccount>;
}

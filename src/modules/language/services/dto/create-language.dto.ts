import { IsEmpty, IsOptional, IsString } from 'class-validator';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export class CreateLanguageDto {
  @IsString()
  name: string;
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

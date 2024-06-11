import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { Tax } from 'src/typeorm/entities/user-tax.entity';
import { DeepPartial } from 'typeorm';

export class CreateUserTaxDto {
  businessType: string;
  address: string;
  email?: string;
  taxCode: string;
  photoLicense: string[];
  photoCatholic: string[];
  modifiedBy: DeepPartial<UserAccount>;
  createdBy: DeepPartial<UserAccount>;
}

export class UpdateUserTaxDto {
  businessType?: string;
  address?: string;
  email?: string;
  taxCode?: string;
  photoLicense?: string[];
  photoCatholic?: string[];
}

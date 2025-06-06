import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export class CreateUserContactDto {
  phone: string;
  note: string;
  user: DeepPartial<UserAccount>;
}

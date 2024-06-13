import { USER_ACTION_TYPE } from 'src/shared/constants/global.constants';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export class CreateUserActionDto {
  content?: string;
  actionType: USER_ACTION_TYPE;
  value?: number;
  createdBy: DeepPartial<UserAccount>;
  toUser: DeepPartial<UserAccount>;
  fromUser: DeepPartial<UserAccount>;
}

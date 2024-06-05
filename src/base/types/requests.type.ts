import { Request } from 'express';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';

export interface RequestWithUser extends Request {
  user: UserAccount;
}

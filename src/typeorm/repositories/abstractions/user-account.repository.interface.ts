import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';

export interface IUserAccountRepository extends IBaseRepository<UserAccount> {}

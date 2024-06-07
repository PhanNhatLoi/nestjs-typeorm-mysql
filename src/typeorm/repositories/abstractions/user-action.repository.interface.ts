import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { UserAction } from 'src/typeorm/entities/user-action.entity';

export interface IUserActionRepository extends IBaseRepository<UserAction> {}

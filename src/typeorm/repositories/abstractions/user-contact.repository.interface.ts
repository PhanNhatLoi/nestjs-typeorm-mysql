import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { UserContact } from 'src/typeorm/entities/user-contact.entity';

export interface IUserContactRepository extends IBaseRepository<UserContact> {}

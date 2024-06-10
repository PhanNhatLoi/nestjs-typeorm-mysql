import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';

export interface IUserVerifyRepository extends IBaseRepository<UserVerify> {}

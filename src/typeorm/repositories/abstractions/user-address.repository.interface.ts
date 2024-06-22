import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { UserAddress } from 'src/typeorm/entities/user-address.entity';

export interface IUserAddressRepository extends IBaseRepository<UserAddress> {}

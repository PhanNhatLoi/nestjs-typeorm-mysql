import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { IUserAddressRepository } from './abstractions/user-address.repository.interface';
import { UserAddress } from '../entities/user-address.entity';

export class UserAddressRepository
  extends BaseRepository<UserAddress>
  implements IUserAddressRepository
{
  constructor(
    @InjectRepository(UserAddress, 'identity')
    private readonly _userAddressRepository: Repository<UserAddress>,
  ) {
    super(_userAddressRepository);
  }
}

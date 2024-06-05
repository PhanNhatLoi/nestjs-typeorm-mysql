import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { IUserAccountRepository } from 'src/typeorm/repositories/abstractions/user-account.repository.interface';
import { Repository } from 'typeorm';

export class UserAccountRepository
  extends BaseRepository<UserAccount>
  implements IUserAccountRepository
{
  constructor(
    @InjectRepository(UserAccount, 'identity')
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {
    super(userAccountRepository);
  }
}

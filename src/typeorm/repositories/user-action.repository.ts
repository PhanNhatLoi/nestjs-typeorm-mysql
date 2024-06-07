import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { UserAction } from '../entities/user-action.entity';
import { IUserActionRepository } from './abstractions/user-action.repository.interface';

export class UserActionRepository
  extends BaseRepository<UserAction>
  implements IUserActionRepository
{
  constructor(
    @InjectRepository(UserAction, 'identity')
    private readonly userActionRepository: Repository<UserAction>,
  ) {
    super(userActionRepository);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { UserContact } from '../entities/user-contact.entity';
import { IUserContactRepository } from './abstractions/user-contact.repository.interface';

export class TaxRepository
  extends BaseRepository<UserContact>
  implements IUserContactRepository
{
  constructor(
    @InjectRepository(UserContact, 'identity')
    private readonly userContactRepository: Repository<UserContact>,
  ) {
    super(userContactRepository);
  }
}

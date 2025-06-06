import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';
import { Repository } from 'typeorm';
import { IUserVerifyRepository } from 'src/typeorm/repositories/abstractions/user-verify.repository.interface';

export class UserVerifyRepository
  extends BaseRepository<UserVerify>
  implements IUserVerifyRepository
{
  constructor(
    @InjectRepository(UserVerify, 'identity')
    private readonly userVerifyRepository: Repository<UserVerify>,
  ) {
    super(userVerifyRepository);
  }
}

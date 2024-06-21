import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Ward } from '../entities/ward.entity';
import { IWardRepository } from './abstractions/ward.repository.interface';

export class WardRepository
  extends BaseRepository<Ward>
  implements IWardRepository
{
  constructor(
    @InjectRepository(Ward, 'identity')
    private readonly _wardRepository: Repository<Ward>,
  ) {
    super(_wardRepository);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Business } from '../entities/business.entity';
import { IBusinessRepository } from './abstractions/business.repository.interface';

export class BusinessRepository
  extends BaseRepository<Business>
  implements IBusinessRepository
{
  constructor(
    @InjectRepository(Business, 'identity')
    private readonly businessRepository: Repository<Business>,
  ) {
    super(businessRepository);
  }
}

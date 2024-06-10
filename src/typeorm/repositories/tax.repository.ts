import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Tax } from '../entities/user-tax.entity';
import { ITaxRepository } from './abstractions/tax.repository.interface';

export class TaxRepository
  extends BaseRepository<Tax>
  implements ITaxRepository
{
  constructor(
    @InjectRepository(Tax, 'identity')
    private readonly taxRepository: Repository<Tax>,
  ) {
    super(taxRepository);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Discount } from '../entities/discount.entity';
import { IDiscountRepository } from './abstractions/discount.repository.interface';

export class DiscountRepository
  extends BaseRepository<Discount>
  implements IDiscountRepository
{
  constructor(
    @InjectRepository(Discount, 'identity')
    private readonly discountRepository: Repository<Discount>,
  ) {
    super(discountRepository);
  }
}

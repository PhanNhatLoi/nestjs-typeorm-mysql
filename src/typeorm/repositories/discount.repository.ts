import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Discount } from 'src/typeorm/entities/discount.entity';
import { IDiscountRepository } from 'src/typeorm/repositories/abstractions/discount.repository.interface';

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

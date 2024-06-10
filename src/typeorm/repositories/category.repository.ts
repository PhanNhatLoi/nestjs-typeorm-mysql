import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from './abstractions/category.repository.interface';

export class TaxRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(Category, 'identity')
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Category } from 'src/typeorm/entities/category.entity';
import { ICategoryRepository } from 'src/typeorm/repositories/abstractions/category.repository.interface';

export class CategoryRepository
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

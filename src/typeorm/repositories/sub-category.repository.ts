import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';
import { ISubCategoryRepository } from 'src/typeorm/repositories/abstractions/sub-category.repository.interface';

export class SubCategoryRepository
  extends BaseRepository<SubCategory>
  implements ISubCategoryRepository
{
  constructor(
    @InjectRepository(SubCategory, 'identity')
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {
    super(subCategoryRepository);
  }
}

import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';

export interface ISubCategoryRepository extends IBaseRepository<SubCategory> {}

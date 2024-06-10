import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { Category } from 'src/typeorm/entities/category.entity';

export interface ICategoryRepository extends IBaseRepository<Category> {}

import { Result } from 'src/base/response/result';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { Category } from 'src/typeorm/entities/category.entity';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

export abstract class ICategoryService {
  abstract create(
    user: DeepPartial<UserAccount>,
    payload: CreateCategoryDto,
  ): Promise<Result<Category>>;
  abstract getPagination(
    filter: FilterCategoryDto,
  ): Promise<Result<PaginationResult<Category>>>;
  abstract get(id: number): Promise<Result<Category>>;
  abstract update(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: UpdateCategoryDto,
  ): Promise<Result<Category>>;
  abstract delete(id: number): Promise<Result<Boolean>>;
  abstract gets(): Promise<Result<Category[]>>;
  abstract getByIds(ids: Number[]): Promise<Result<Category[]>>;
}

import { Result } from 'src/base/response/result';
import { CreateSubCategoryDto } from '@modules/sub-category/services/dto/CreateCategory.dto';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';
import { FilterSubCategoryDto } from '@modules/sub-category/services/dto/filter-category.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UpdateSubCategoryDto } from '@modules/sub-category/services/dto/update-category.dto';

export abstract class ISubCategoryService {
  abstract create(
    user: DeepPartial<UserAccount>,
    payload: CreateSubCategoryDto,
  ): Promise<Result<SubCategory>>;
  abstract getPagination(
    filter: FilterSubCategoryDto,
  ): Promise<Result<PaginationResult<SubCategory>>>;
  abstract get(id: number): Promise<Result<SubCategory>>;
  abstract update(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: UpdateSubCategoryDto,
  ): Promise<Result<SubCategory>>;
  abstract delete(id: number): Promise<Result<Boolean>>;
  abstract gets(): Promise<Result<SubCategory[]>>;
  abstract getByIds(ids: Number[]): Promise<Result<SubCategory[]>>;
}

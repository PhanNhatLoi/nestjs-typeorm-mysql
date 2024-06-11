import { Result } from 'src/base/response/result';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';

export abstract class ISubCategoryService {
  abstract create(payload: CreateCategoryDto): Promise<Result<SubCategory>>;
  // abstract getPagination(
  //   filter: FilterUserAccountDto,
  // ): Promise<Result<PaginationResult<UserAccount>>>;
  abstract get(id: number): Promise<Result<SubCategory>>;
  // abstract findParams(params: {
  //   [x: string]: any;
  // }): Promise<Result<UserAccount>>;
  // abstract update(
  //   id: number,
  //   payload: UpdateUserAccountDto,
  // ): Promise<Result<UserAccount>>;
  abstract delete(id: number): Promise<Result<SubCategory>>;
  abstract gets(): Promise<Result<SubCategory[]>>;
  abstract getByIds(ids: Number[]): Promise<Result<SubCategory[]>>;
}

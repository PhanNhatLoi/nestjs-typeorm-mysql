import { Result } from 'src/base/response/result';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { Category } from 'src/typeorm/entities/category.entity';

export abstract class ICategoryService {
  abstract create(payload: CreateCategoryDto): Promise<Result<Category>>;
  // abstract getPagination(
  //   filter: FilterUserAccountDto,
  // ): Promise<Result<PaginationResult<UserAccount>>>;
  abstract get(id: number): Promise<Result<Category>>;
  // abstract findParams(params: {
  //   [x: string]: any;
  // }): Promise<Result<UserAccount>>;
  // abstract update(
  //   id: number,
  //   payload: UpdateUserAccountDto,
  // ): Promise<Result<UserAccount>>;
  abstract delete(id: number): Promise<Result<Category>>;
  abstract gets(): Promise<Result<Category[]>>;
  abstract getByIds(ids: Number[]): Promise<Result<Category[]>>;
}

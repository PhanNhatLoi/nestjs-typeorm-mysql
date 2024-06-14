import { Result } from 'src/base/response/result';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UserAction } from 'src/typeorm/entities/user-action.entity';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { UpdateUserActionDto } from './dto/update-user-action.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { FilterUserActionDto } from './dto/filter-action.dto';

export abstract class IUserActionService {
  abstract get(id: number): Promise<Result<UserAction>>;
  abstract create(payload: CreateUserActionDto): Promise<Result<UserAction>>;
  abstract update(
    id: number,
    payload: UpdateUserActionDto,
  ): Promise<Result<UserAction>>;
  abstract findParams(
    params: FindOneOptions<UserAction>,
  ): Promise<Result<UserAction>>;
  abstract delete(id: number): Promise<Result<Boolean>>;
  abstract getPagination(
    filter: FilterUserActionDto,
  ): Promise<Result<PaginationResult<UserAction>>>;
  abstract countByActionType(
    id: number,
    params?: FindOptionsWhere<UserAction>,
  ): Promise<Result<any>>;
}

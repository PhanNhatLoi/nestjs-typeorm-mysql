import { PaginationResult } from 'src/base/response/pagination.result';
import { Result } from 'src/base/response/result';
import { CreateUserAccountDto } from 'src/modules/user-account/dto/create-user-account.dto';
import { FilterUserAccountDto } from 'src/modules/user-account/dto/filter-user-account.dto';
import { UpdateUserAccountDto } from 'src/modules/user-account/dto/update-user-account.dto';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';

export abstract class IUserAccountService {
  abstract create(payload: CreateUserAccountDto): Promise<Result<UserAccount>>;
  abstract getPagination(
    filter: FilterUserAccountDto,
  ): Promise<Result<PaginationResult<UserAccount>>>;
  abstract get(id: number): Promise<Result<UserAccount>>;
  abstract findParams(params: {
    [x: string]: any;
  }): Promise<Result<UserAccount>>;
  abstract update(
    id: number,
    payload: UpdateUserAccountDto,
  ): Promise<Result<UserAccount>>;
  abstract delete(id: string): Promise<Result<UserAccount>>;
  abstract gets(): Promise<Result<UserAccount[]>>;
}

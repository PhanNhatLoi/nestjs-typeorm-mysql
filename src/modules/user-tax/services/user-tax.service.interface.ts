import { Result } from 'src/base/response/result';
import { CreateUserTaxDto, UpdateUserTaxDto } from './dto/CreateUserTax.dto';
import { Tax } from 'src/typeorm/entities/user-tax.entity';

export abstract class IUserTaxService {
  abstract create(payload: CreateUserTaxDto): Promise<Result<Tax>>;
  // abstract getPagination(
  //   filter: FilterUserAccountDto,
  // ): Promise<Result<PaginationResult<UserAccount>>>;
  abstract get(id: number): Promise<Result<Tax>>;
  abstract findParams(params: { [x: string]: any }): Promise<Result<Tax>>;
  abstract update(id: number, payload: UpdateUserTaxDto): Promise<Result<Tax>>;
  abstract delete(id: number): Promise<Result<Tax>>;
  abstract gets(): Promise<Result<Tax[]>>;
  abstract getByIds(ids: Number[]): Promise<Result<Tax[]>>;
}

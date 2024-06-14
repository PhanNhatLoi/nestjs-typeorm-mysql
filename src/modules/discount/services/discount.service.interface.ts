import { Result } from 'src/base/response/result';
import { CreateDiscountDto } from './dto/create-language.dto';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { FilterDiscountDto } from './dto/filter-discount.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { Discount } from 'src/typeorm/entities/discount.entity';
import { UpdateDiscountDto } from './dto/update-discount.dto';

export abstract class IDiscountService {
  abstract getPagination(
    filter: FilterDiscountDto,
  ): Promise<Result<PaginationResult<Discount>>>;
  abstract create(
    createdBy: DeepPartial<UserAccount>,
    payload: CreateDiscountDto,
  ): Promise<Result<Discount>>;
  abstract update(
    createdBy: DeepPartial<UserAccount>,
    id: number,
    payload: UpdateDiscountDto,
  ): Promise<Result<Discount>>;
  abstract get(id: number): Promise<Result<Discount>>;
  abstract delete(id: number): Promise<Result<Boolean>>;
}

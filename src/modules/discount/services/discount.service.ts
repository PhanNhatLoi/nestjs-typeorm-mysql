import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
  MoreThan,
} from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { CreateDiscountDto } from './dto/create-language.dto';
import { IDiscountRepository } from 'src/typeorm/repositories/abstractions/discount.repository.interface';
import { PaginationResult } from 'src/base/response/pagination.result';
import { Discount } from 'src/typeorm/entities/discount.entity';
import { FilterDiscountDto } from './dto/filter-discount.dto';
import { IJoinQuery } from 'src/base/repositories/base-repository.interface';
import { IUserAccountService } from '@modules/user-account/services/user-account.service.interface';
import { IDiscountService } from './discount.service.interface';
import { USER_ROLE } from 'src/shared/constants/global.constants';

@Injectable()
export class DiscountService implements IDiscountService {
  constructor(
    @Inject('IDiscountRepository')
    private readonly _discountRepository: IDiscountRepository,
    private readonly _userAccountService: IUserAccountService,
  ) {}

  async getPagination(
    filter: FilterDiscountDto,
  ): Promise<Result<PaginationResult<Discount>>> {
    //custom filter
    const conditions = {
      isDeleted: false,
    } as FindOptionsWhere<Discount>;

    if (filter.keyword) {
      conditions.title = Like(`%${filter.keyword}%`);
      conditions.description = Like(`%${filter.keyword}%`);
    }

    const joinQuery: IJoinQuery[] = [
      {
        queryString: `expiresTime > :nowTime`,
        queryParams: { nowTime: new Date() },
      },
    ];
    if (filter.userId) {
      joinQuery.push({
        queryString: 'user.id = :id',
        queryParams: { id: filter.userId },
      });
    }
    let order: FindOptionsOrder<Discount>;
    if (filter.orderBy) {
      order = {};
      const temp = filter.orderBy.split(',');
      if (temp[1] && ['ACS', 'DESC'].includes(temp[1].toUpperCase()))
        order[`user.${temp[0].trim()}`] = temp[1].toUpperCase().trim();
    }

    const result = await this._discountRepository.getPagination(
      filter.page,
      filter.limit,
      {
        where: conditions,
        order: order,
        select: ['discount'],
        random: true,
      },
      {
        alias: 'discount',
        leftJoinAndSelect: {
          user: 'discount.user',
        },
        joinQuery: joinQuery,
      },
    );
    return Results.success(result);
  }

  async create(
    createdBy: DeepPartial<UserAccount>,
    payload: CreateDiscountDto,
  ): Promise<Result<Discount>> {
    const checkUser = await this._userAccountService.get(payload.userId);
    if (
      !checkUser.response ||
      checkUser.response.role === USER_ROLE.SUPPER_ADMIN
    ) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND,
        details: 'User not found!!!',
      });
    }
    if (payload.expiresTime < (payload.startDate || new Date())) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND,
        details: 'expires time must more than now!!!',
      });
    }
    const result = await this._discountRepository.save({
      ...payload,
      user: checkUser.response,
      createdBy: createdBy,
      modifiedBy: createdBy,
    });
    return await this.get(result.id);
  }

  async get(id: number): Promise<Result<Discount>> {
    const result = await this._discountRepository.findOneByConditions({
      where: {
        id: id,
        isDeleted: false,
        expiresTime: MoreThan(new Date()),
      },
    });
    if (!result) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Discount not found!!!',
      });
    }

    return Results.success(result);
  }
  async update(
    createdBy: DeepPartial<UserAccount>,
    id: number,
    payload: CreateDiscountDto,
  ): Promise<Result<Discount>> {
    const discount = await this.get(id);

    await this._discountRepository.save({
      ...discount.response,
      ...payload,
      modifiedDate: new Date(),
      modifiedBy: createdBy,
    });

    return await this.get(id);
  }
  async delete(id: number): Promise<Result<Boolean>> {
    const result = await this.get(id);
    await this._discountRepository.softDelete(result.response.id);
    return Results.success(true);
  }
}

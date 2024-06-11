import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import { PaginationResult } from 'src/base/response/pagination.result';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { CreateUserAccountDto } from 'src/modules/user-account/dto/create-user-account.dto';
import { FilterUserAccountDto } from 'src/modules/user-account/dto/filter-user-account.dto';
import { UpdateUserAccountDto } from 'src/modules/user-account/dto/update-user-account.dto';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { IUserAccountRepository } from 'src/typeorm/repositories/abstractions/user-account.repository.interface';
import { Like } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { AccountInfoResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

export const saltOrRounds = 10;

@Injectable()
export class UserAccountService implements IUserAccountService {
  constructor(
    @Inject('IUserAccountRepository')
    private readonly _userAccountRepository: IUserAccountRepository,
  ) {}
  async gets(): Promise<Result<UserAccount[]>> {
    const result = await this._userAccountRepository.findAll({
      where: { ...DefaultFilterQueryable },
    });
    return Results.success(result);
  }

  async create(
    payload: CreateUserAccountDto,
  ): Promise<Result<AccountInfoResponseDto>> {
    const checkUnique = await this._userAccountRepository.findOneByConditions({
      where: {
        email: payload.email,
      },
    });
    if (checkUnique) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_EXISTED,
        details: 'User exits!!!',
      });
    }

    const passwordHash = await bcrypt.hash(payload.password, saltOrRounds);

    const newAccount = {
      ...payload,

      password: passwordHash,
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdBy: 0,
      modifiedBy: 0,
    };
    const userAccount = await this._userAccountRepository.save(newAccount);
    if (userAccount) {
      delete userAccount.password;
      delete userAccount.isDeleted;
    }
    return Results.success(userAccount);
  }

  async getPagination(
    filter: FilterUserAccountDto,
  ): Promise<Result<PaginationResult<UserAccount>>> {
    const conditions = {} as any;
    if (filter.name) {
      conditions.AccountName = Like(`%${filter.name}%`);
    }
    const result = await this._userAccountRepository.getPagination(
      filter.page,
      filter.limit,
      {
        where: conditions,
        order: filter.orderByQueryClause,
      },
    );
    return Results.success(result);
  }
  async get(id: number): Promise<Result<AccountInfoResponseDto>> {
    const result = await this._userAccountRepository.findOneById(id);
    if (result) {
      delete result.password;
      delete result.isDeleted;
    }
    return Results.success(result);
  }
  async findParams(params: { [x: string]: any }): Promise<Result<UserAccount>> {
    const result = await this._userAccountRepository.findOneByConditions({
      where: params,
    });
    if (result) {
      // delete result.password;
    } else {
      return Results.badRequest('User not found');
    }
    return Results.success(result);
  }
  async update(
    id: number,
    payload: UpdateUserAccountDto,
  ): Promise<Result<UserAccount>> {
    const Account = await this._userAccountRepository.findOneById(id);
    if (!Account) {
      return Results.notFound();
    }
    const updatedAccount = {
      ...Account,
      ...payload,
      ModifiedBy: 1,
      ModifiedDate: new Date(),
    };
    const result = await this._userAccountRepository.save(updatedAccount);
    return Results.success(result);
  }
  async delete(id: string): Promise<Result<UserAccount>> {
    const Account = await this._userAccountRepository.findOneById(id);
    if (!Account) {
      return Results.notFound();
    }
    const result = await this._userAccountRepository.delete(Account);
    return Results.success(result);
  }

  async findUserWithRelations(userId: number): Promise<Result<UserAccount>> {
    const user = await this._userAccountRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.subCategories',
        'subCategory',
        'subCategory.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect(
        'user.categories',
        'category',
        'category.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .leftJoinAndSelect('user.tax', 'tax', 'tax.isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .where('user.id = :id', { id: userId })
      .getOne();

    delete user.isDeleted;
    delete user.isLoggedIn;
    delete user.password;
    return Results.success(user);
  }
}

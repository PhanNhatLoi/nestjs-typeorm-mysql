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
import { FindOptionsOrder, FindOptionsWhere, In, Like } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { AccountInfoResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import {
  IJoinQuery,
  INearby,
} from 'src/base/repositories/base-repository.interface';

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
    //custom filter
    const conditions = {
      isDeleted: false,
      role: In([USER_ROLE.USER, USER_ROLE.ENTERPRISE]),
    } as FindOptionsWhere<UserAccount> & { nearby?: INearby };

    const joinQuery: IJoinQuery[] = [];
    if (filter.category) {
      joinQuery.push({
        queryString: 'categories.id = :id',
        queryParams: { id: filter.category },
      });
    }
    if (filter['sub-category']) {
      joinQuery.push({
        queryString: 'subCategories.id = :id',
        queryParams: { id: filter['sub-category'] },
      });
    }
    if (filter.name) {
      conditions.name = Like(`%${filter.name}%`);
    }

    //custom sort

    let order: FindOptionsOrder<UserAccount>;
    if (filter.orderBy) {
      order = {};
      const temp = filter.orderBy.split(',');
      if (temp[1] && ['ACS', 'DESC'].includes(temp[1].toUpperCase()))
        order[`user.${temp[0].trim()}`] = temp[1].toUpperCase().trim();
    }

    const result = await this._userAccountRepository.getPagination(
      filter.page,
      filter.limit,
      {
        where: conditions,
        order: order,
        nearby: filter.lat &&
          filter.lng &&
          filter.radius && {
            lat: filter.lat,
            lng: filter.lng,
            radius: filter.radius,
          },
        select: [
          'user.id',
          'user.createdDate',
          'user.email',
          'user.phone',
          'user.address',
          'user.job',
          'user.role',
          'user.profileImage',
          'user.bannerMedia',
          'user.referralID',
          'user.emailVerified',
          'user.name',
          'user.websiteURL',
          'user.nationality',
          'user.favoriteBibleWords',
          'user.introduction',
          'user.socialLinks',
          'user.achievements',
          'user.averageRating',
          'user.location',
        ],
      },
      {
        alias: 'user',
        leftJoinAndSelect: {
          categories: 'user.categories',
          subCategories: 'user.subCategories',
        },
        joinQuery: joinQuery,
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
      .where('user.id = :id', { id: userId })
      .andWhere('user.emailVerified = :emailVerified', { emailVerified: true })
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
      .getOne();

    if (!user) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND,
        details: 'User not found!!!',
      });
    }
    if (user.isDeleted) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_DELETED,
        details: 'User is deleted!!!',
      });
    }

    delete user.isDeleted;
    delete user.isLoggedIn;
    delete user.password;
    return Results.success(user);
  }

  async getUserNearby(
    filter: FilterUserAccountDto,
  ): Promise<Result<PaginationResult<UserAccount>>> {
    //custom filter
    const conditions = {
      isDeleted: false,
      role: In([USER_ROLE.USER, USER_ROLE.ENTERPRISE]),
    } as FindOptionsWhere<UserAccount>;

    const joinQuery: IJoinQuery[] = [];
    if (filter.category) {
      joinQuery.push({
        queryString: 'categories.id = :id',
        queryParams: { id: filter.category },
      });
    }
    if (filter['sub-category']) {
      joinQuery.push({
        queryString: 'subCategories.id = :id',
        queryParams: { id: filter['sub-category'] },
      });
    }
    if (filter.name) {
      conditions.name = Like(`%${filter.name}%`);
    }

    //custom sort

    let order: FindOptionsOrder<UserAccount>;
    if (filter.orderBy) {
      order = {};
      const temp = filter.orderBy.split(',');
      if (temp[1] && ['ACS', 'DESC'].includes(temp[1].toUpperCase()))
        order[`user.${temp[0].trim()}`] = temp[1].toUpperCase().trim();
    }

    const result = await this._userAccountRepository.getPagination(
      filter.page,
      filter.limit,
      {
        where: conditions,
        order: order,
        select: [
          'user.id',
          'user.createdDate',
          'user.email',
          'user.phone',
          'user.address',
          'user.job',
          'user.role',
          'user.profileImage',
          'user.bannerMedia',
          'user.referralID',
          'user.emailVerified',
          'user.name',
          'user.websiteURL',
          'user.nationality',
          'user.favoriteBibleWords',
          'user.introduction',
          'user.socialLinks',
          'user.achievements',
          'user.averageRating',
          'user.location',
        ],
      },
      {
        alias: 'user',
        leftJoinAndSelect: {
          categories: 'user.categories',
          subCategories: 'user.subCategories',
        },
        joinQuery: joinQuery,
      },
    );
    return Results.success(result);
  }
}

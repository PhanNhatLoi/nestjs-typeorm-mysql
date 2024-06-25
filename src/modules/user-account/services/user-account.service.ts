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
import { FindOptionsOrder, FindOptionsWhere, In, Like, Not } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { AccountInfoResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import { IJoinQuery } from 'src/base/repositories/base-repository.interface';
import { Category } from 'src/typeorm/entities/category.entity';
import { ISubCategoryRepository } from 'src/typeorm/repositories/abstractions/sub-category.repository.interface';

export const saltOrRounds = 10;

@Injectable()
export class UserAccountService implements IUserAccountService {
  constructor(
    @Inject('IUserAccountRepository')
    private readonly _userAccountRepository: IUserAccountRepository,
    @Inject('ISubCategoryRepository')
    private readonly _subCategoryRepository: ISubCategoryRepository,
  ) {}
  async gets(): Promise<Result<UserAccount[]>> {
    const result = await this._userAccountRepository.findAll({
      where: { ...DefaultFilterQueryable, emailVerified: true },
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
    if (checkUnique?.emailVerified) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_EXISTED,
        details: 'User exits!!!',
      });
    }

    const passwordHash = await bcrypt.hash(payload.password, saltOrRounds);

    const newAccount = {
      ...payload,
      id: checkUnique?.id || undefined,
      password: passwordHash,
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
    userId?: number,
  ): Promise<Result<PaginationResult<UserAccount>>> {
    //custom filter
    const conditions = {
      isDeleted: false,
      emailVerified: true,
      role: In([USER_ROLE.USER, USER_ROLE.ENTERPRISE]),
    } as FindOptionsWhere<UserAccount>;
    let subCategories = [];
    if (userId) {
      conditions.id = Not(userId);
      if (filter.orderBy?.includes('relation')) {
        subCategories = await this._subCategoryRepository.findAll({
          where: {
            users: {
              id: userId,
            },
          },
        });
      }
    }
    const relationSortType = filter.orderBy?.includes('relation')
      ? filter.orderBy.split(',')[1] || undefined
      : undefined;
    delete filter.orderBy;

    const joinQuery: IJoinQuery[] = [];
    if (filter.category) {
      joinQuery.push({
        queryString: 'categories.id = :id',
        queryParams: { id: filter.category },
      });
      joinQuery.push({
        queryString: 'categories.isDeleted = :isDeleted',
        queryParams: { isDeleted: false },
      });
    }
    if (filter['sub-category']) {
      joinQuery.push({
        queryString: 'subCategories.id = :id',
        queryParams: { id: filter['sub-category'] },
      });
      joinQuery.push({
        queryString: 'subCategories.isDeleted = :isDeleted',
        queryParams: { isDeleted: false },
      });
    }

    if (filter.province) {
      joinQuery.push({
        queryString: 'province.id = :id',
        queryParams: { id: filter.province },
      });
    }
    if (filter.district) {
      joinQuery.push({
        queryString: 'district.id = :id',
        queryParams: { id: filter.district },
      });
    }
    if (filter.ward) {
      joinQuery.push({
        queryString: 'ward.id = :id',
        queryParams: { id: filter.ward },
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
      if (temp[1] && ['ACS', 'DESC'].includes(temp[1].toUpperCase())) {
        if (temp[0].toLocaleLowerCase() === 'lasted-post') {
          order[`discounts.createdDate`] = temp[1].toUpperCase().trim();
        } else order[`user.${temp[0].trim()}`] = temp[1].toUpperCase().trim();
      }
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
        customSort: (data: UserAccount[]) => {
          if (subCategories.length)
            return this.sortUserAccountsBySimilarity(
              data,
              subCategories,
              (relationSortType?.toLocaleUpperCase() as 'DESC' | 'ASC') ||
                'DESC',
            );
          return data;
        },
        select: [
          'user.id',
          'user.createdDate',
          'user.email',
          'user.phone',
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
          'user.favorite',
          'user.view',
          'user.averageRatingFromAdmin',
          'categories',
          'subCategories',
          'address',
          'ward.name',
          'ward.id',
          'district.name',
          'district.id',
          'province.name',
          'province.id',
          'discounts',
        ],
      },
      {
        alias: 'user',
        leftJoinAndSelect: {
          categories: 'user.categories',
          subCategories: 'user.subCategories',
          discounts: 'user.discounts',
          address: 'user.userAddress',
          ward: 'address.ward',
          district: 'ward.district',
          province: 'district.province',
        },
        joinQuery: joinQuery,
      },
    );
    return Results.success(result);
  }

  // Function to calculate similarity
  calculateSimilarity(
    userCategories: Category[],
    givenCategories: Category[],
  ): number {
    const userCategoryIds = userCategories.map((category) => category.id);
    const givenCategoryIds = givenCategories.map((category) => category.id);

    const matchingCategories = userCategoryIds.filter((id) =>
      givenCategoryIds.includes(id),
    );
    return matchingCategories.length;
  }

  // Function to sort user accounts by similarity
  sortUserAccountsBySimilarity(
    userAccounts: UserAccount[],
    givenCategories: Category[],
    type: 'DESC' | 'ASC',
  ): UserAccount[] {
    return userAccounts.sort((a, b) => {
      const similarityA = this.calculateSimilarity(
        a.categories,
        givenCategories,
      );
      const similarityB = this.calculateSimilarity(
        b.categories,
        givenCategories,
      );
      if (type === 'DESC') return similarityB - similarityA; // Sort in descending order
      return similarityA - similarityB; // Sort in asc order
    });
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
      .leftJoinAndSelect(
        'user.userAddress',
        'userAddress',
        'userAddress.isDeleted = :isDeleted',
        {
          isDeleted: false,
        },
      )
      .leftJoinAndSelect('userAddress.ward', 'ward')
      .leftJoinAndSelect('ward.district', 'district')
      .leftJoinAndSelect('district.province', 'province')
      .leftJoinAndSelect(
        'userAddress.ward',
        'wardAddress',
        'ward.isDeleted = :isDeleted AND district.isDeleted = :isDeleted AND province.isDeleted = :isDeleted',
        {
          isDeleted: false,
        },
      )
      .leftJoinAndSelect(
        'wardAddress.district',
        'districtAddress',
        'district.isDeleted = :isDeleted AND province.isDeleted = :isDeleted',
        {
          isDeleted: false,
        },
      )
      .leftJoinAndSelect(
        'districtAddress.province',
        'provinceAddress',
        'province.isDeleted = :isDeleted',
        {
          isDeleted: false,
        },
      )
      .select([
        'user',
        'category',
        'subCategory',
        'tax',
        'userAddress.address',
        'userAddress.id',
        'wardAddress.id',
        'wardAddress.name',
        'districtAddress.id',
        'districtAddress.name',
        'provinceAddress.id',
        'provinceAddress.name',
      ])
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

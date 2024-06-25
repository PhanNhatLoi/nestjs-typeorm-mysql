import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { IUserActionService } from './user-action.service.interface';
import { IUserActionRepository } from 'src/typeorm/repositories/abstractions/user-action.repository.interface';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UserAction } from 'src/typeorm/entities/user-action.entity';
import { UpdateUserActionDto } from './dto/update-user-action.dto';
import { FilterUserActionDto } from './dto/filter-action.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { FindOptionsWhere } from 'typeorm';
import {
  USER_ACTION_TYPE,
  USER_ROLE,
} from 'src/shared/constants/global.constants';
import { IUserAccountService } from '@modules/user-account/services/user-account.service.interface';

@Injectable()
export class UserActionService implements IUserActionService {
  constructor(
    @Inject('IUserActionRepository')
    private readonly _userActionRepository: IUserActionRepository,
    @Inject('IUserAccountRepository')
    private readonly _userAccountService: IUserAccountService,
  ) {}

  async get(id: number): Promise<Result<UserAction>> {
    const result = await this._userActionRepository.findOneById(id);
    if (!result) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Data not found!!!',
      });
    }
    return Results.success(result);
  }

  async create(payload: CreateUserActionDto): Promise<Result<UserAction>> {
    const result = await this._userActionRepository.save({
      ...payload,
      createdBy: payload.createdBy,
      modifiedBy: payload.createdBy,
    });

    return Results.success((await this.get(result.id)).response);
  }

  async update(
    id: number,
    payload: UpdateUserActionDto,
  ): Promise<Result<UserAction>> {
    const result = await this._userActionRepository.findOneByConditions({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Data not found!!!',
      });
    }

    await this._userActionRepository.save({
      ...result,
      ...payload,
      modifiedDate: new Date(),
      modifiedBy: result.createdBy,
    });

    return Results.success(
      await this._userActionRepository.findOneByConditions({
        where: {
          id: id,
        },
      }),
    );
  }

  async findParams(params: { [x: string]: any }): Promise<Result<UserAction>> {
    const result = await this._userActionRepository.findOneByConditions(params);
    if (!result) {
      Results.notFound();
    }
    return Results.success(result);
  }
  async delete(id: number): Promise<Result<Boolean>> {
    const result = await this._userActionRepository.findOneById(id);
    if (!result) {
      Results.notFound();
    }
    await this._userActionRepository.softDelete(id);
    return Results.success(true);
  }
  async getPagination(
    filter: FilterUserActionDto,
  ): Promise<Result<PaginationResult<UserAction>>> {
    const conditions = {
      isDeleted: false,
    } as FindOptionsWhere<UserAction>;

    if (filter.actionType) {
      conditions.actionType = filter.actionType;
    }
    if (filter.toUserId) {
      conditions.toUser = {
        id: filter.toUserId,
      };
    }
    if (filter.createdById) {
      conditions.createdBy = {
        id: filter.createdById,
      };
    }
    const result = await this._userActionRepository.getPagination(
      filter.page || 1,
      filter.limit || 5,
      {
        where: conditions,
        order: filter.orderByQueryClause,
        select: [
          'user_action',
          'createdBy.id',
          'createdBy.email',
          'createdBy.name',
          'createdBy.profileImage',
          'createdBy.bannerMedia',
          'createdBy.isDeleted',
          'toUser.id',
          'toUser.email',
          'toUser.name',
          'toUser.profileImage',
          'toUser.bannerMedia',
          'toUser.isDeleted',
        ],
      },
      {
        alias: 'user_action',
        leftJoinAndSelect: {
          createdBy: 'user_action.createdBy',
          toUser: 'user_action.toUser',
        },
      },
    );
    return Results.success(result);
  }

  async countByActionType(id: number): Promise<Result<any>> {
    const queryBuilder = await this._userActionRepository
      .createQueryBuilder('user_action')
      .leftJoinAndSelect('user_action.toUser', 'toUser')
      .where('toUser.id = :id', { id: id })
      .andWhere('user_action.isDeleted = :isDeleted', { isDeleted: false })
      .select(['user_action'])
      .getMany();
    let initResult = {};
    Object.keys(USER_ACTION_TYPE).map((item) => {
      initResult[item] = 0;
    });

    const groupedActions = queryBuilder.reduce((result, action) => {
      const actionType = action.actionType;
      if (!result[actionType]) {
        result[actionType] = 0;
      }
      result[actionType] = result[actionType] + 1;
      return result;
    }, initResult);

    return Results.success(groupedActions);
  }
  async updateAverageRating(id: number): Promise<boolean> {
    const queryBuilderFromUser = await this._userActionRepository
      .createQueryBuilder('user_action')
      .leftJoinAndSelect('user_action.toUser', 'toUser')
      .leftJoinAndSelect('user_action.fromUser', 'fromUser')
      .where('toUser.id = :id', { id: id })
      .andWhere('user_action.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user_action.actionType = :actionType', {
        actionType: USER_ACTION_TYPE.RATE,
      })
      .andWhere('fromUser.role != :role', { role: USER_ROLE.SUPPER_ADMIN })
      .select([
        'SUM(user_action.value) / Count(user_action.value) averageRating',
      ])
      .getRawOne();
    const averageRatingFromUser = Number(
      queryBuilderFromUser.averageRating,
    ).toFixed(1);
    const queryBuilderFromAdmin = await this._userActionRepository
      .createQueryBuilder('user_action')
      .leftJoinAndSelect('user_action.toUser', 'toUser')
      .leftJoinAndSelect('user_action.fromUser', 'fromUser')
      .where('toUser.id = :id', { id: id })
      .andWhere('user_action.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user_action.actionType = :actionType', {
        actionType: USER_ACTION_TYPE.RATE,
      })
      .andWhere('fromUser.role = :role', { role: USER_ROLE.SUPPER_ADMIN })
      .select([
        'SUM(user_action.value) / Count(user_action.value) averageRating',
      ])
      .getRawOne();

    const averageRatingFromAdmin = Number(
      queryBuilderFromAdmin.averageRating,
    ).toFixed(1);
    await this._userAccountService.update(id, {
      averageRating: averageRatingFromUser,
      averageRatingFromAdmin: averageRatingFromAdmin,
    });
    return true;
  }
  async updateFavorite(id: number): Promise<boolean> {
    const queryBuilder = await this._userActionRepository
      .createQueryBuilder('user_action')
      .leftJoinAndSelect('user_action.toUser', 'toUser')
      .where('toUser.id = :id', { id: id })
      .andWhere('user_action.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user_action.actionType = :actionType', {
        actionType: USER_ACTION_TYPE.FAVORITE,
      })
      .getCount();
    await this._userAccountService.update(id, {
      favorite: queryBuilder,
    });
    return true;
  }
}

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
import { USER_ACTION_TYPE } from 'src/shared/constants/global.constants';

@Injectable()
export class UserActionService implements IUserActionService {
  constructor(
    @Inject('IUserActionRepository')
    private readonly _userActionRepository: IUserActionRepository,
  ) {}

  async get(id: number): Promise<Result<UserAction>> {
    const result = await this._userActionRepository.findOneById(id);
    if (!result) {
      console.log(12345);
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
      createdDate: new Date(),
      modifiedDate: new Date(),
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
        ],
      },
      {
        alias: 'user_action',
        leftJoinAndSelect: {
          createdBy: 'user_action.createdBy',
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
}

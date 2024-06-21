import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { IUserContactService } from './user-contact.service.interface';
import { UserContact } from 'src/typeorm/entities/user-contact.entity';
import { IUserContactRepository } from 'src/typeorm/repositories/abstractions/user-contact.repository.interface';
import { DeepPartial, Like } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { CreateUserContactDto } from '@modules/user-contact/dto/create-user-contact.dto';
import { CONTACT_STATUS } from 'src/shared/constants/global.constants';
import { FilterUserContactDto } from '../dto/filter-contact.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { IJoinQuery } from 'src/base/repositories/base-repository.interface';

@Injectable()
export class UserContactService implements IUserContactService {
  constructor(
    @Inject('IUserContactRepository')
    private readonly _userContactRepository: IUserContactRepository,
  ) {}

  async create(
    createdBy: DeepPartial<UserAccount>,
    payload: CreateUserContactDto,
  ): Promise<Result<UserContact>> {
    const result = await this._userContactRepository.save({
      ...payload,
      createdBy: createdBy,
      modifiedBy: createdBy,
    });
    return Results.success((await this.get(result.id)).response);
  }

  async get(id: number): Promise<Result<UserContact>> {
    const result = await this._userContactRepository.findOneById(id);
    return Results.success(result);
  }
  async update(
    id: number,
    createdBy: DeepPartial<UserAccount>,
    status: CONTACT_STATUS,
  ): Promise<Result<UserContact>> {
    const result = await this._userContactRepository.findOneByConditions({
      where: {
        id: id,
        isDeleted: false,
        createdBy: {
          id: createdBy.id,
        },
      },
    });
    if (!result) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: `data not found!!!`,
      });
    }

    await this._userContactRepository.save({
      ...result,
      status: status,
      modifiedDate: new Date(),
    });
    return Results.success((await this.get(result.id)).response);
  }

  async getPagination(
    filter: FilterUserContactDto,
  ): Promise<Result<PaginationResult<UserContact>>> {
    const conditions = {
      isDeleted: false,
    } as any;
    if (filter.name) {
      conditions.name = Like(`%${filter.name}%`);
    }
    const joinQuery: IJoinQuery[] = [];
    if (filter.userId) {
      joinQuery.push({
        queryString: 'user.id = :id',
        queryParams: { id: filter.userId },
      });
    }
    const result = await this._userContactRepository.getPagination(
      filter.page || 1,
      filter.limit || 5,
      {
        where: conditions,
        order: filter.orderByQueryClause,
        select: [
          'user_contact',
          'createdBy.id',
          'createdBy.role',
          'createdBy.isDeleted',
          'createdBy.name',
          'createdBy.profileImage',
        ],
      },
      {
        alias: 'user_contact',
        leftJoinAndSelect: {
          user: 'user_contact.user',
          createdBy: 'user_contact.createdBy',
        },
        joinQuery: joinQuery,
      },
    );
    return Results.success(result);
  }
}

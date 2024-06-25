import { Injectable, BadRequestException } from '@nestjs/common';
import { PaginationResult } from 'src/base/response/pagination.result';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { FilterUserAccountDto } from 'src/modules/user-account/dto/filter-user-account.dto';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { AccountInfoResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import { IPartnerService, OtherAction } from './partner.service.interface';
import { IUserAccountService } from '@modules/user-account/services/user-account.service.interface';
import {
  USER_ACTION_TYPE,
  USER_ROLE,
} from 'src/shared/constants/global.constants';
import { UserAction } from 'src/typeorm/entities/user-action.entity';
import { IUserActionService } from '@modules/user-action/services/user-action.service.interface';
import { FilterUserActionDto } from '@modules/user-action/services/dto/filter-action.dto';
import { CreateContactDto } from '@modules/partner/dto/create-contact.dto';
import { UserContact } from 'src/typeorm/entities/user-contact.entity';
import { IUserContactService } from '@modules/user-contact/services/user-contact.service.interface';
import { FilterUserContactDto } from '@modules/user-contact/dto/filter-contact.dto';

@Injectable()
export class PartnerService implements IPartnerService {
  constructor(
    private readonly _userAccountService: IUserAccountService,
    private readonly _userActionService: IUserActionService,
    private readonly _userContactService: IUserContactService,
  ) {}

  async getPagination(
    filter: FilterUserAccountDto,
    userId?: number,
  ): Promise<Result<PaginationResult<UserAccount>>> {
    const result = await this._userAccountService.getPagination(filter, userId);
    return Results.success(result.response);
  }
  async get(id: number): Promise<Result<AccountInfoResponseDto>> {
    const result = await this._userAccountService.findUserWithRelations(id);
    if (result.response.role === USER_ROLE.SUPPER_ADMIN) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: `Partner not found!!!`,
      });
    }
    delete result.response.password;
    delete result.response.isLoggedIn;
    delete result.response.isDeleted;
    delete result.response.tax;
    delete result.response.role;
    delete result.response.emailVerified;
    delete result.response.accessKey;

    return Results.success(result.response);
  }
  async favorite(
    user: DeepPartial<UserAccount>,
    id: number,
  ): Promise<Result<UserAction>> {
    const toUser = await this.checkValidateUser(id, user.id);
    const checkFavorite = await this._userActionService.findParams({
      where: {
        actionType: USER_ACTION_TYPE.FAVORITE,

        createdBy: {
          id: user.id,
        },
        toUser: {
          id: Number(id),
        },
      },
    });

    if (checkFavorite.response) {
      const result = await this._userActionService.update(
        checkFavorite.response.id,
        {
          isDeleted: !checkFavorite.response.isDeleted,
        },
      );
      await this._userActionService.updateFavorite(Number(id));
      return Results.success(result.response);
    } else {
      const result = await this._userActionService.create({
        actionType: USER_ACTION_TYPE.FAVORITE,
        fromUser: user,
        toUser: toUser,
        createdBy: user,
      });
      await this._userActionService.updateFavorite(Number(id));
      return Results.success(result.response);
    }
  }

  async getShare(
    userId: number,
    filter: FilterUserActionDto,
  ): Promise<Result<PaginationResult<UserAction>>> {
    filter.actionType = USER_ACTION_TYPE.SHARE;
    filter.fromUserId = userId;
    const result = await this._userActionService.getPagination(filter);
    return Results.success(result.response);
  }

  async share(
    createdBy: DeepPartial<UserAccount>,
    fromUserId: number,
    toUserId: number,
  ): Promise<Result<UserAction>> {
    if (fromUserId === toUserId) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.VALIDATION_ERROR,
        details: `Don't action for themselves!!!`,
      });
    }
    const fromUser = await this.checkValidateUser(fromUserId, createdBy.id);

    const toUser = await this.checkValidateUser(toUserId, createdBy.id);

    const checkShare = await this._userActionService.findParams({
      where: {
        createdBy: {
          id: createdBy.id,
        },
        fromUser: {
          id: fromUserId,
        },

        toUser: {
          id: toUserId,
        },
        actionType: USER_ACTION_TYPE.SHARE,
      },
    });

    //todo after change deep link or information....

    if (checkShare.response) return Results.success(checkShare.response);
    else {
      return Results.success(
        await this._userActionService.create({
          actionType: USER_ACTION_TYPE.SHARE,
          fromUser: fromUser,
          toUser: toUser,
          createdBy: createdBy,
        }),
      ).response;
    }
  }

  async rate(
    createdBy: DeepPartial<UserAccount>,
    toUserId: number,
    payload: {
      value: number;
      content: string;
    },
  ): Promise<Result<UserAction>> {
    if (createdBy.id === toUserId) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.VALIDATION_ERROR,
        details: `Don't action for themselves!!!`,
      });
    }

    const toUser = await this.checkValidateUser(toUserId, createdBy.id);

    const checkShare = await this._userActionService.findParams({
      where: {
        createdBy: {
          id: createdBy.id,
        },
        toUser: {
          id: toUserId,
        },
        actionType: USER_ACTION_TYPE.RATE,
        isDeleted: false,
      },
    });

    if (checkShare.response) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: `Rate already exists!!!`,
      });
    } else {
      const result = await this._userActionService.create({
        actionType: USER_ACTION_TYPE.RATE,
        fromUser: createdBy,
        toUser: toUser,
        createdBy: createdBy,
        content: payload.content,
        value: payload.value,
      });
      await this._userActionService.updateAverageRating(toUserId);
      return Results.success(result.response);
    }
  }
  async deleteRate(
    user: DeepPartial<UserAccount>,
    id: number,
  ): Promise<Result<Boolean>> {
    const rate = await this._userActionService.findParams({
      where: {
        id: id,
        isDeleted: false,
        createdBy: {
          id: user.id,
        },
      },
      relations: {
        toUser: true,
      },
    });
    if (!rate.response) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: `Rate not found!!!`,
      });
    }
    const result = await this._userActionService.delete(id);
    await this._userActionService.updateAverageRating(rate.response.toUser.id);

    return result;
  }
  async updateRate(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: { value?: number; content?: string },
  ): Promise<Result<UserAction>> {
    const result = await this._userActionService.findParams({
      where: {
        id: id,
        createdBy: {
          id: user.id,
        },
        isDeleted: false,
      },
      relations: {
        toUser: true,
      },
    });
    if (!result.response) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: `Rate not found!!!`,
      });
    }
    const updateResult = await this._userActionService.update(id, payload);
    await this._userActionService.updateAverageRating(
      result.response.toUser.id,
    );
    return updateResult;
  }

  async otherAction(
    user: DeepPartial<UserAccount>,
    id: number,
    action: OtherAction,
  ): Promise<Result<UserAction>> {
    const toUser = await this.checkValidateUser(id, user.id);
    const checkView = await this._userActionService.findParams({
      where: {
        actionType: action as USER_ACTION_TYPE,
        createdBy: {
          id: user.id,
        },
        toUser: {
          id: Number(id),
        },
      },
    });

    if (checkView.response) {
      return Results.success(checkView.response);
    } else {
      if (action === USER_ACTION_TYPE.VIEW) {
        await this._userAccountService.update(id, {
          view: toUser.view + 1,
        });
      }
      return Results.success(
        await this._userActionService.create({
          actionType: action as USER_ACTION_TYPE,
          fromUser: user,
          toUser: toUser,
          createdBy: user,
        }),
      ).response;
    }
  }

  async getAction(
    userId: number,
    filter: FilterUserActionDto,
    actionType: USER_ACTION_TYPE,
  ): Promise<Result<PaginationResult<UserAction>>> {
    filter.actionType = actionType;
    filter.toUserId = userId;
    const result = await this._userActionService.getPagination(filter);
    return Results.success(result.response);
  }

  async createContact(
    user: DeepPartial<UserAccount>,
    payload: CreateContactDto,
  ): Promise<Result<UserContact>> {
    const toUser = await this.checkValidateUser(
      Number(payload.toUserId),
      user.id,
    );

    return Results.success(
      await this._userContactService.create(user, {
        ...payload,
        user: toUser,
      }),
    ).response;
  }

  async checkValidateUser(id: number, userId: number): Promise<UserAccount> {
    if (id === userId) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.VALIDATION_ERROR,
        details: `Don't action for yourself!!!`,
      });
    }
    const findUser = await this._userAccountService.get(id);
    if (!findUser.response || findUser.response.emailVerified === false) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND,
        details: 'Partner not found!!!',
      });
    }

    return findUser.response;
  }
  async getContacts(
    id: number,
    filter: FilterUserContactDto,
  ): Promise<Result<PaginationResult<UserContact>>> {
    filter.userId = id;

    return Results.success(
      (await this._userContactService.getPagination(filter)).response,
    );
  }
}

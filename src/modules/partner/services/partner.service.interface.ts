import { FilterUserActionDto } from '@modules/user-action/services/dto/filter-action.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { Result } from 'src/base/response/result';
import { FilterUserAccountDto } from 'src/modules/user-account/dto/filter-user-account.dto';
import { USER_ACTION_TYPE } from 'src/shared/constants/global.constants';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAction } from 'src/typeorm/entities/user-action.entity';
import { UserContact } from 'src/typeorm/entities/user-contact.entity';
import { DeepPartial } from 'typeorm';
import { CreateContactDto } from '@modules/partner/dto/create-contact.dto';
import { FilterUserContactDto } from '@modules/user-contact/dto/filter-contact.dto';

export type OtherAction =
  | USER_ACTION_TYPE.VIEW
  | USER_ACTION_TYPE.VIEW_PAGE
  | USER_ACTION_TYPE.SEARCH;

export abstract class IPartnerService {
  abstract getPagination(
    filter: FilterUserAccountDto,
    userId?: number,
  ): Promise<Result<PaginationResult<UserAccount>>>;
  abstract get(id: number): Promise<Result<UserAccount>>;

  abstract getShare(
    userId: number,
    filter: FilterUserActionDto,
  ): Promise<Result<PaginationResult<UserAction>>>;

  abstract favorite(
    user: DeepPartial<UserAccount>,
    id: number,
  ): Promise<Result<UserAction>>;
  abstract share(
    createdBy: DeepPartial<UserAccount>,
    fromUserId: number,
    toUserId: number,
  ): Promise<Result<UserAction>>;
  abstract otherAction(
    user: DeepPartial<UserAccount>,
    id: number,
    action: OtherAction,
  ): Promise<Result<UserAction>>;
  abstract getAction(
    userId: number,
    filter: FilterUserActionDto,
    actionType: USER_ACTION_TYPE,
  ): Promise<Result<PaginationResult<UserAction>>>;
  abstract rate(
    createdBy: DeepPartial<UserAccount>,
    toUserId: number,
    payload: {
      value: number;
      content: string;
    },
  ): Promise<Result<UserAction>>;
  abstract deleteRate(
    user: DeepPartial<UserAccount>,
    id: number,
  ): Promise<Result<Boolean>>;
  abstract updateRate(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: {
      value?: number;
      content?: string;
    },
  ): Promise<Result<UserAction>>;
  abstract createContact(
    user: DeepPartial<UserAccount>,
    payload: CreateContactDto,
  ): Promise<Result<UserContact>>;
  abstract getContacts(
    id: number,
    filter: FilterUserContactDto,
  ): Promise<Result<PaginationResult<UserContact>>>;
}

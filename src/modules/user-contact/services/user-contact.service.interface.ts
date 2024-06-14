import { Result } from 'src/base/response/result';
import { UserContact } from 'src/typeorm/entities/user-contact.entity';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { CreateUserContactDto } from '@modules/user-contact/dto/create-user-contact.dto';
import { CONTACT_STATUS } from 'src/shared/constants/global.constants';
import { FilterUserContactDto } from '../dto/filter-contact.dto';
import { PaginationResult } from 'src/base/response/pagination.result';

export abstract class IUserContactService {
  abstract create(
    createdBy: DeepPartial<UserAccount>,
    payload: CreateUserContactDto,
  ): Promise<Result<UserContact>>;
  abstract get(id: number): Promise<Result<UserContact>>;
  abstract update(
    id: number,
    createdBy: DeepPartial<UserAccount>,
    status: CONTACT_STATUS,
  ): Promise<Result<UserContact>>;
  abstract getPagination(
    filter: FilterUserContactDto,
  ): Promise<Result<PaginationResult<UserContact>>>;
}

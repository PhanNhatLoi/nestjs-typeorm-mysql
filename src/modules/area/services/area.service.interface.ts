import { Result } from 'src/base/response/result';
import { ResponseAreaDto } from '../dto/area-response.dto';
import { AREA_TYPE } from 'src/shared/constants/global.constants';
import { FilterAreaDto } from '../dto/filter.dto';
import { CreateAreaDto } from '../dto/create.dto';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export abstract class IAreaService {
  abstract create(
    payload: CreateAreaDto,
    user: DeepPartial<UserAccount>,
  ): Promise<Result<ResponseAreaDto>>;
  abstract update(
    id: number,
    payload: CreateAreaDto,
    user: DeepPartial<UserAccount>,
  ): Promise<Result<ResponseAreaDto>>;
  abstract gets(
    type: AREA_TYPE,
    query: FilterAreaDto,
  ): Promise<Result<ResponseAreaDto[]>>;
  abstract get(type: AREA_TYPE, id: number): Promise<Result<ResponseAreaDto>>;
  abstract delete(type: AREA_TYPE, id: number): Promise<Result<boolean>>;
}

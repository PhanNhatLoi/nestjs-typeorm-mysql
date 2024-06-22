import {
  BadRequestException,
  Inject,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { IAreaService } from './area.service.interface';
import { IProvinceRepository } from 'src/typeorm/repositories/abstractions/province.repository.interface';
import { ResponseAreaDto } from '../dto/area-response.dto';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { AREA_TYPE } from 'src/shared/constants/global.constants';
import { IDistrictRepository } from 'src/typeorm/repositories/abstractions/district.repository.interface';
import { IWardRepository } from 'src/typeorm/repositories/abstractions/ward.repository.interface';
import { FilterAreaDto } from '../dto/filter.dto';
import { CreateAreaDto } from '../dto/create.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial, Like, Not } from 'typeorm';

@Injectable()
export class AreaService implements IAreaService {
  constructor(
    @Inject('IProvinceRepository')
    private readonly _provinceRepository: IProvinceRepository,
    @Inject('IDistrictRepository')
    private readonly _districtRepository: IDistrictRepository,
    @Inject('IWardRepository')
    private readonly _wardRepository: IWardRepository,
  ) {}

  async gets(
    type: AREA_TYPE,
    filter: FilterAreaDto,
  ): Promise<Result<ResponseAreaDto[]>> {
    if (!Object.keys(AREA_TYPE).includes(type.toLocaleUpperCase())) {
      throw new MethodNotAllowedException();
    }

    const conditions = {
      isDeleted: false,
    } as any;
    if (filter.name) {
      conditions.name = Like(`%${filter.name}%`);
    }
    if (filter.province && type === AREA_TYPE.DISTRICT) {
      conditions.province = {
        id: Number(filter.province),
      };
    }
    if (filter.district && type === AREA_TYPE.WARD) {
      conditions.district = {
        id: Number(filter.district),
      };
    }

    switch (type.toUpperCase()) {
      case AREA_TYPE.PROVINCE:
        return Results.success(
          await this._provinceRepository.findAll({
            where: {
              ...conditions,
              isDeleted: false,
            },
            select: ['id', 'name'],
          }),
        );
      case AREA_TYPE.DISTRICT:
        return Results.success(
          await this._districtRepository.findAll({
            where: {
              ...conditions,
              isDeleted: false,
            },
            select: ['id', 'name'],
          }),
        );
      case AREA_TYPE.WARD:
        return Results.success(
          await this._wardRepository.findAll({
            where: {
              ...conditions,
              isDeleted: false,
            },
            select: ['id', 'name'],
          }),
        );
      default:
        break;
    }
  }
  async create(
    payload: CreateAreaDto,
    user: DeepPartial<UserAccount>,
  ): Promise<Result<ResponseAreaDto>> {
    if (!Object.keys(AREA_TYPE).includes(payload.type.toLocaleUpperCase())) {
      throw new MethodNotAllowedException();
    }
    switch (payload.type.toUpperCase()) {
      case AREA_TYPE.PROVINCE:
        const checkUnique1 = await this._provinceRepository.findOneByConditions(
          {
            where: {
              isDeleted: false,
              name: payload.name,
            },
          },
        );
        if (checkUnique1) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.ALREADY_EXISTS,
            details: 'Province exits!!!',
          });
        }
        const result1 = await this._provinceRepository.save({
          name: payload.name,
          createdBy: user,
          modifiedBy: user,
        });
        return await this.get(payload.type, result1.id);
      case AREA_TYPE.DISTRICT:
        const checkUnique2 = await this._districtRepository.findOneByConditions(
          {
            where: {
              isDeleted: false,
              name: payload.name,
            },
          },
        );
        if (checkUnique2) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.ALREADY_EXISTS,
            details: 'District exits!!!',
          });
        }
        const checkParent = await this._provinceRepository.findOneByConditions({
          where: {
            isDeleted: false,
            id: payload.parentId,
          },
        });
        if (!checkParent || !payload.parentId) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.NOT_FOUND,
            details: 'Province not found!!!',
          });
        }
        const result2 = await this._districtRepository.save({
          name: payload.name,
          createdBy: user,
          province: checkParent,
          modifiedBy: user,
        });
        return await this.get(payload.type, result2.id);
      case AREA_TYPE.WARD:
        const checkUnique3 = await this._wardRepository.findOneByConditions({
          where: {
            isDeleted: false,
            name: payload.name,
          },
        });
        if (checkUnique3) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.ALREADY_EXISTS,
            details: 'Ward exits!!!',
          });
        }
        const checkParent2 = await this._districtRepository.findOneByConditions(
          {
            where: {
              isDeleted: false,
              id: payload.parentId,
            },
          },
        );
        if (!checkParent2 || !payload.parentId) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.NOT_FOUND,
            details: 'District not found!!!',
          });
        }
        const result3 = await this._wardRepository.save({
          name: payload.name,
          district: checkParent2,
          createdBy: user,
          modifiedBy: user,
        });
        return await this.get(payload.type, result3.id);
      default:
        break;
    }
  }
  async update(
    id: number,
    payload: CreateAreaDto,
    user: DeepPartial<UserAccount>,
  ): Promise<Result<ResponseAreaDto>> {
    if (!Object.keys(AREA_TYPE).includes(payload.type.toLocaleUpperCase())) {
      throw new MethodNotAllowedException();
    }
    switch (payload.type.toUpperCase()) {
      case AREA_TYPE.PROVINCE:
        const result1 = await this.get(payload.type, id);
        if (!result1.response) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.NOT_FOUND,
            details: 'Province not found!!!',
          });
        }

        const checkUnique1 = await this._provinceRepository.findOneByConditions(
          {
            where: {
              id: Not(id),
              isDeleted: false,
              name: payload.name,
            },
          },
        );
        if (checkUnique1) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.ALREADY_EXISTS,
            details: 'Province exits!!!',
          });
        }
        await this._provinceRepository.save({
          ...result1.response,
          ...payload,
          modifiedBy: user,
          modifiedDate: new Date(),
        });
        return await this.get(payload.type, result1.response.id);
      case AREA_TYPE.DISTRICT:
        const result2 = await this.get(payload.type, id);
        if (!result2.response) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.NOT_FOUND,
            details: 'Province not found!!!',
          });
        }

        const checkUnique2 = await this._districtRepository.findOneByConditions(
          {
            where: {
              id: Not(id),
              isDeleted: false,
              name: payload.name,
            },
          },
        );
        if (checkUnique2) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.ALREADY_EXISTS,
            details: 'District exits!!!',
          });
        }
        if (payload.parentId) {
          const checkParent =
            await this._provinceRepository.findOneByConditions({
              where: {
                isDeleted: false,
                id: payload.parentId,
              },
            });
          if (!checkParent || !payload.parentId) {
            throw new BadRequestException({
              message: ERRORS_DICTIONARY.NOT_FOUND,
              details: 'Province not found!!!',
            });
          }
          payload.province = checkParent;
        }
        await this._districtRepository.save({
          ...result2.response,
          ...payload,
          modifiedBy: user,
          modifiedDate: new Date(),
        });
        return await this.get(payload.type, result2.response.id);
      case AREA_TYPE.WARD:
        const result3 = await this.get(payload.type, id);
        if (!result3.response) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.NOT_FOUND,
            details: 'Ward not found!!!',
          });
        }

        const checkUnique3 = await this._wardRepository.findOneByConditions({
          where: {
            id: Not(id),
            isDeleted: false,
            name: payload.name,
          },
        });
        if (checkUnique3) {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.ALREADY_EXISTS,
            details: 'Ward exits!!!',
          });
        }
        if (payload.parentId) {
          const checkParent =
            await this._districtRepository.findOneByConditions({
              where: {
                isDeleted: false,
                id: payload.parentId,
              },
            });
          if (!checkParent || !payload.parentId) {
            throw new BadRequestException({
              message: ERRORS_DICTIONARY.NOT_FOUND,
              details: 'District not found!!!',
            });
          }
          payload.district = checkParent;
        }
        await this._wardRepository.save({
          ...result3.response,
          ...payload,
          modifiedBy: user,
          modifiedDate: new Date(),
        });
        return await this.get(payload.type, result3.response.id);
      default:
        break;
    }
  }
  async get(type: AREA_TYPE, id: number): Promise<Result<ResponseAreaDto>> {
    if (!Object.keys(AREA_TYPE).includes(type.toLocaleUpperCase())) {
      throw new MethodNotAllowedException();
    }
    switch (type.toUpperCase()) {
      case AREA_TYPE.PROVINCE:
        return Results.success(
          await this._provinceRepository.findOneWithRelations({
            where: {
              id: id,
              isDeleted: false,
            },
            relations: {
              districts: true,
            },
          }),
        );
      case AREA_TYPE.DISTRICT:
        return Results.success(
          await this._districtRepository.findOneWithRelations({
            where: {
              id: id,
              isDeleted: false,
              province: {
                isDeleted: false,
              },
            },
            relations: {
              province: true,
              wards: true,
            },
          }),
        );
      case AREA_TYPE.WARD:
        return Results.success(
          await this._wardRepository.findOneWithRelations({
            where: {
              id: id,
              isDeleted: false,
              district: {
                isDeleted: false,
              },
            },
            relations: {
              district: true,
            },
          }),
        );
      default:
        break;
    }
  }

  async delete(type: AREA_TYPE, id: number): Promise<Result<boolean>> {
    if (!Object.keys(AREA_TYPE).includes(type.toLocaleUpperCase())) {
      throw new MethodNotAllowedException();
    }
    const result = await this.get(type, id);
    if (!result.response) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: `${type} not found!!!`,
      });
    }
    switch (type.toUpperCase()) {
      case AREA_TYPE.PROVINCE:
        return Results.success(
          await this._provinceRepository.softDelete(result.response.id),
        );
      case AREA_TYPE.DISTRICT:
        return Results.success(
          await this._districtRepository.softDelete(result.response.id),
        );
      case AREA_TYPE.WARD:
        return Results.success(
          await this._wardRepository.softDelete(result.response.id),
        );
      default:
        break;
    }

    return;
  }
}

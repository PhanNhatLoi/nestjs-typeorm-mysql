import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Result } from 'src/base/response/result';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';
import { Results } from 'src/base/response/result-builder';
import { CreateSubCategoryDto } from './dto/CreateCategory.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import { DeepPartial, In, Like, Not } from 'typeorm';
import { ISubCategoryService } from './sub-category.service.interface';
import { ISubCategoryRepository } from 'src/typeorm/repositories/abstractions/sub-category.repository.interface';
import { FilterSubCategoryDto } from './dto/filter-category.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UpdateSubCategoryDto } from './dto/update-category.dto';
import { ICategoryService } from '@modules/category/services/category.service.interface';
import { IJoinQuery } from 'src/base/repositories/base-repository.interface';

@Injectable()
export class SubCategoryService implements ISubCategoryService {
  constructor(
    @Inject('ISubCategoryRepository')
    private readonly _subCategoryRepository: ISubCategoryRepository,
    private readonly _categoryService: ICategoryService,
  ) {}
  async create(
    user: DeepPartial<UserAccount>,
    payload: CreateSubCategoryDto,
  ): Promise<Result<SubCategory>> {
    const checkUnique = await this._subCategoryRepository.findOneByConditions({
      where: {
        name: payload.name,
      },
    });
    if (checkUnique) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: 'Sub category name exits!!!',
      });
    }
    const checkParent = await this._categoryService.get(payload.category);
    if (!checkParent.response) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'ParentId not found exits!!!',
      });
    }

    const result = await this._subCategoryRepository.save({
      ...payload,
      createdBy: user,
      parent: checkParent.response,
    });
    return Results.success((await this.get(result.id)).response);
  }
  async get(id: number): Promise<Result<SubCategory>> {
    const result = await this._subCategoryRepository.findOneWithRelations({
      where: {
        id: id,
        isDeleted: false,
        parent: {
          isDeleted: false,
        },
      },
      relations: {
        parent: true,
      },
    });
    if (!result) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Sub category not found!!!',
      });
    }
    delete result.isDeleted;
    return Results.success(result);
  }
  async gets(): Promise<Result<SubCategory[]>> {
    const result = await this._subCategoryRepository.findAll({
      where: {
        ...DefaultFilterQueryable,
        parent: {
          isDeleted: false,
        },
      },
    });
    return Results.success(result);
  }

  async delete(id: number): Promise<Result<Boolean>> {
    const subCategory = await this._subCategoryRepository.findOneById(id);
    if (!subCategory) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Sub category not found!!!',
      });
    }
    const result = await this._subCategoryRepository.softDelete(id);
    return Results.success(result);
  }

  async getByIds(ids: number[]): Promise<Result<SubCategory[]>> {
    const result = await this._subCategoryRepository.findAll({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });

    return Results.success(result);
  }

  async getPagination(
    filter: FilterSubCategoryDto,
  ): Promise<Result<PaginationResult<SubCategory>>> {
    const conditions = {
      isDeleted: false,
    } as any;
    if (filter.name) {
      conditions.name = Like(`%${filter.name}%`);
    }
    if (filter.category) {
      conditions.parent = {
        id: In(filter.category.split(',')),
      };
    }
    const joinQuery: IJoinQuery[] = [
      {
        queryString: `category.isDeleted = :isDeleted`,
        queryParams: { isDeleted: false },
      },
    ];
    const result = await this._subCategoryRepository.getPagination(
      filter.page || 1,
      filter.limit || 5,
      {
        where: conditions,
        order: filter.orderByQueryClause,
      },
      {
        alias: 'subCategory',
        leftJoinAndSelect: {
          category: 'subCategory.parent',
        },
        joinQuery: joinQuery,
      },
    );
    return Results.success(result);
  }

  async update(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: UpdateSubCategoryDto,
  ): Promise<Result<SubCategory>> {
    const subCategory = await this.get(id);
    if (!subCategory) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Sub Category not found!!!',
      });
    }
    const checkUnique = await this._subCategoryRepository.findOneByConditions({
      where: {
        name: payload.name,
        id: Not(id),
      },
    });
    if (checkUnique) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: 'Sub Category name exist!!!',
      });
    }
    let parent = subCategory.response.parent;
    if (payload.category) {
      const checkParent = await this._categoryService.get(payload.category);
      if (!checkParent.response) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.NOT_FOUND,
          details: `Category with id: ${payload.category} not found!!!`,
        });
      }
      parent = checkParent.response;
    }

    await this._subCategoryRepository.save({
      ...subCategory,
      ...payload,
      parent,
      modifiedBy: user,
      modifiedDate: new Date(),
    });
    return Results.success((await this.get(id)).response);
  }
}

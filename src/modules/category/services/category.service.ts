import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICategoryService } from './category.service.interface';
import { ICategoryRepository } from 'src/typeorm/repositories/abstractions/category.repository.interface';
import { Result } from 'src/base/response/result';
import { Category } from 'src/typeorm/entities/category.entity';
import { Results } from 'src/base/response/result-builder';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import { DeepPartial, In, Like, Not } from 'typeorm';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { PaginationResult } from 'src/base/response/pagination.result';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly _categoryRepository: ICategoryRepository,
  ) {}
  async create(
    user: DeepPartial<UserAccount>,
    payload: CreateCategoryDto,
  ): Promise<Result<Category>> {
    const checkUnique = await this._categoryRepository.findOneByConditions({
      where: {
        name: payload.name,
      },
    });
    if (checkUnique) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: 'Category name exits!!!',
      });
    }
    const result = await this._categoryRepository.save({
      ...payload,
      createdBy: user,
      modifiedBy: user,
    });

    return Results.success((await this.get(result.id)).response);
  }
  async get(id: number): Promise<Result<Category>> {
    const result = await this._categoryRepository.findOneById(id);
    if (result) {
      delete result.isDeleted;
    }
    return Results.success(result);
  }
  async gets(): Promise<Result<Category[]>> {
    const result = await this._categoryRepository.findAll({
      where: { ...DefaultFilterQueryable },
    });
    return Results.success(result);
  }

  async delete(id: number): Promise<Result<Boolean>> {
    const category = await this._categoryRepository.findOneById(id);
    if (!category) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Category not found!!!',
      });
    }
    const result = await this._categoryRepository.softDelete(id);
    return Results.success(result);
  }

  async getByIds(ids: number[]): Promise<Result<Category[]>> {
    const result = await this._categoryRepository.findAll({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });

    return Results.success(result);
  }

  async getPagination(
    filter: FilterCategoryDto,
  ): Promise<Result<PaginationResult<Category>>> {
    const conditions = {
      isDeleted: false,
    } as any;
    if (filter.name) {
      conditions.name = Like(`%${filter.name}%`);
    }
    const result = await this._categoryRepository.getPagination(
      filter.page || 1,
      filter.limit || 5,
      {
        where: conditions,
        order: filter.orderByQueryClause,
      },
      {
        alias: 'category',
        leftJoinAndSelect: {
          categories: 'category.children',
        },
      },
    );
    return Results.success(result);
  }

  async update(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: UpdateCategoryDto,
  ): Promise<Result<Category>> {
    const category = await this._categoryRepository.findOneById(id);
    if (!category) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'Category not found!!!',
      });
    }
    const checkUnique = await this._categoryRepository.findOneByConditions({
      where: {
        name: payload.name,
        id: Not(id),
      },
    });
    if (checkUnique) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: 'Category name exist!!!',
      });
    }

    await this._categoryRepository.save({
      ...category,
      ...payload,
      modifiedBy: user,
      modifiedDate: new Date(),
    });
    return Results.success((await this.get(id)).response);
  }
}

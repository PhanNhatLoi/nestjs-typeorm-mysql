import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from 'src/typeorm/repositories/abstractions/category.repository.interface';
import { Result } from 'src/base/response/result';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';
import { Results } from 'src/base/response/result-builder';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import { In } from 'typeorm';
import { ISubCategoryService } from './sub-category.service.interface';
import { ISubCategoryRepository } from 'src/typeorm/repositories/abstractions/sub-category.repository.interface';

@Injectable()
export class SubCategoryService implements ISubCategoryService {
  constructor(
    @Inject('ISubCategoryRepository')
    private readonly _subCategoryRepository: ISubCategoryRepository,
  ) {}
  async create(payload: CreateCategoryDto): Promise<Result<SubCategory>> {
    const checkUnique = await this._subCategoryRepository.findOneByConditions({
      where: {
        name: payload.name,
      },
    });
    if (checkUnique) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: 'User exits!!!',
      });
    }
    const result = await this._subCategoryRepository.create({
      ...payload,
      createdDate: new Date(),
    });
    return Results.success(result);
  }
  async get(id: number): Promise<Result<SubCategory>> {
    const result = await this._subCategoryRepository.findOneById(id);
    if (result) {
      delete result.isDeleted;
    }
    return Results.success(result);
  }
  async gets(): Promise<Result<SubCategory[]>> {
    const result = await this._subCategoryRepository.findAll({
      where: { ...DefaultFilterQueryable },
    });
    return Results.success(result);
  }

  async delete(id: number): Promise<Result<SubCategory>> {
    const Account = await this._subCategoryRepository.findOneById(id);
    if (!Account) {
      return Results.notFound();
    }
    const result = await this._subCategoryRepository.delete(Account);
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

  //   async update(
  //     id: number,
  //     payload: UpdateUserAccountDto,
  //   ): Promise<Result<UserAccount>> {
  //     const Account = await this._userAccountRepository.findOneById(id);
  //     if (!Account) {
  //       return Results.notFound();
  //     }
  //     const updatedAccount = {
  //       ...Account,
  //       ...payload,
  //       ModifiedBy: 1,
  //       ModifiedDate: new Date(),
  //     };
  //     const result = await this._userAccountRepository.save(updatedAccount);
  //     return Results.success(result);
  //   }
}

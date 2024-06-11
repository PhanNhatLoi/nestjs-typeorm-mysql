import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ICategoryService } from './category.service.interface';
import { ICategoryRepository } from 'src/typeorm/repositories/abstractions/category.repository.interface';
import { Result } from 'src/base/response/result';
import { Category } from 'src/typeorm/entities/category.entity';
import { Results } from 'src/base/response/result-builder';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import { In } from 'typeorm';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly _categoryRepository: ICategoryRepository,
  ) {}
  async create(payload: CreateCategoryDto): Promise<Result<Category>> {
    const checkUnique = await this._categoryRepository.findOneByConditions({
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
    const result = await this._categoryRepository.create({
      ...payload,
      createdDate: new Date(),
    });
    return Results.success(result);
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

  async delete(id: number): Promise<Result<Category>> {
    const Account = await this._categoryRepository.findOneById(id);
    if (!Account) {
      return Results.notFound();
    }
    const result = await this._categoryRepository.delete(Account);
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

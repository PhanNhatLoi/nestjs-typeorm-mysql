import { Inject, Injectable } from '@nestjs/common';
import { IUserTaxService } from './user-tax.service.interface';
import { Result } from 'src/base/response/result';
import { Tax } from 'src/typeorm/entities/user-tax.entity';
import { Results } from 'src/base/response/result-builder';
import { CreateUserTaxDto, UpdateUserTaxDto } from './dto/CreateUserTax.dto';
import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import { In } from 'typeorm';
import { ITaxRepository } from 'src/typeorm/repositories/abstractions/tax.repository.interface';

@Injectable()
export class UserTaxService implements IUserTaxService {
  constructor(
    @Inject('ITaxRepository')
    private readonly _taxRepository: ITaxRepository,
  ) {}
  async create(payload: CreateUserTaxDto): Promise<Result<Tax>> {
    const result = await this._taxRepository.create({
      ...payload,
    });
    const newTax = await this._taxRepository.save(result);
    return Results.success(newTax);
  }
  async get(id: number): Promise<Result<Tax>> {
    const result = await this._taxRepository.findOneById(id);
    if (result) {
      delete result.isDeleted;
    }
    return Results.success(result);
  }
  async gets(): Promise<Result<Tax[]>> {
    const result = await this._taxRepository.findAll({
      where: { ...DefaultFilterQueryable },
    });
    return Results.success(result);
  }

  async delete(id: number): Promise<Result<Tax>> {
    const Account = await this._taxRepository.findOneById(id);
    if (!Account) {
      return Results.notFound();
    }
    const result = await this._taxRepository.delete(Account);
    return Results.success(result);
  }

  async getByIds(ids: number[]): Promise<Result<Tax[]>> {
    const result = await this._taxRepository.findAll({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });

    return Results.success(result);
  }
  async update(id: number, payload: UpdateUserTaxDto): Promise<Result<Tax>> {
    const tax = await this._taxRepository.findOneById(id);
    if (!tax) {
      return Results.notFound();
    }
    const updatedAccount = {
      ...payload,
      ModifiedBy: id,
      ModifiedDate: new Date(),
    };
    const result = await this._taxRepository.save(updatedAccount);
    return Results.success(result);
  }
  async findParams(params: { [x: string]: any }): Promise<Result<Tax>> {
    const result = await this._taxRepository.findOneByConditions({
      where: params,
    });
    if (result) {
      // delete result.password;
    } else {
      return Results.badRequest('Tax not found');
    }
    return Results.success(result);
  }
}

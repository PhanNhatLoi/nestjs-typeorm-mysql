import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { PaginationResult } from 'src/base/response/pagination.result';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface HasId {
  id: string | number;
}

export abstract class BaseRepository<T extends HasId>
  implements IBaseRepository<T>
{
  private repository: Repository<T>;
  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }
  async query(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters);
  }
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }
  async count(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<number> {
    const conditions = {
      ...where,
      ...DefaultFilterQueryable,
    };
    return await this.repository.countBy(conditions);
  }
  async softDelete(id: any): Promise<boolean> {
    const result = await this.update({ id: id, ...DefaultFilterQueryable }, {
      isDeleted: true,
    } as any);
    return result.affected > 0;
  }

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }
  createMany(data: DeepPartial<T>[]): T[] {
    return this.repository.create(data);
  }
  async save(data: DeepPartial<T>): Promise<T> {
    return await this.repository.save(data);
  }
  async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.repository.save(data);
  }
  async findOneById(id: any): Promise<T> {
    const options = {
      id: id,
      ...DefaultFilterQueryable,
    } as any;

    return await this.repository.findOneBy({
      ...options,
    });
  }
  async findOneByConditions(conditions: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOne(conditions);
  }
  async findAll(options: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }
  async delete(data: T): Promise<T> {
    return await this.repository.remove(data);
  }
  async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(relations);
  }
  async preload(entity: DeepPartial<T>): Promise<T> {
    return await this.repository.preload(entity);
  }
  async getPagination(
    page: number,
    limit: number,
    query?: FindManyOptions<T>,
  ): Promise<PaginationResult<T>> {
    if (typeof limit === 'string') {
      limit = parseInt(limit);
    }

    if (typeof page === 'string') {
      page = parseInt(page);
    }

    const take = limit;
    const skip = (page - 1) * limit;
    const count = await this.repository.count(query);

    const result = new PaginationResult<T>();
    result.meta.page = page;
    result.meta.limit = limit;
    result.meta.total = count;
    result.meta.pageCount = Math.ceil(result.meta.total / result.meta.limit);
    result.data = await this.repository.find({
      ...query,
      take,
      skip,
    });

    return result;
  }
  async update(
    condition: Record<string, any>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    const result = await this.repository.count({ where: condition });
    if (result <= 0) {
      throw new Error('Entity not found');
    }
    return await this.repository.update(condition, partialEntity);
  }
}

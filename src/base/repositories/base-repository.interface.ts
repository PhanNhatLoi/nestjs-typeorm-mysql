import { PaginationResult } from 'src/base/response/pagination.result';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: string | number): Promise<T>;
  findOneByConditions(conditions: FindOneOptions<T>): Promise<T>;
  findAll(options: FindManyOptions<T>): Promise<T[]>;
  delete(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entity: DeepPartial<T>): Promise<T>;
  getPagination(
    page: number,
    limit: number,
    query?: FindManyOptions<T>,
  ): Promise<PaginationResult<T>>;
  update(
    condition: Record<string, any>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
  softDelete(id: string | number): Promise<boolean>;
  count(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<number>;
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T>;
  query(query: string, parameters?: any[]): Promise<any>;
}

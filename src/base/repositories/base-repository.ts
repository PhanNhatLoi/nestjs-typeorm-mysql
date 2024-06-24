import { DefaultFilterQueryable } from 'src/base/infrastructure/default-filter.queryable';
import {
  IBaseRepository,
  IJoinQuery,
  INearby,
} from 'src/base/repositories/base-repository.interface';
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
  async findOneWithRelations(relations: FindManyOptions<T>): Promise<T> {
    return await this.repository.findOne(relations);
  }
  async preload(entity: DeepPartial<T>): Promise<T> {
    return await this.repository.preload(entity);
  }
  async getPagination(
    page: number,
    limit: number,
    query?: FindManyOptions<T> & {
      nearby?: INearby;
      random?: boolean;
    },
    joinOptions?: {
      alias: string;
      innerJoinAndSelect?: any;
      leftJoinAndSelect?: any;
      joinQuery?: IJoinQuery[];
    },
  ): Promise<PaginationResult<T>> {
    if (typeof limit === 'string') {
      limit = parseInt(limit);
    }

    if (typeof page === 'string') {
      page = parseInt(page);
    }

    const take = limit;
    const skip = (page - 1) * limit;
    // add relation ship
    // create one query builder by joinOptions.alias
    const nameAlias = joinOptions?.alias || 'entity';
    const queryBuilder = this.repository.createQueryBuilder(nameAlias);
    // queryBuilder.orderBy('user.name', 'DESC');
    // default clear item have isDeleted = false
    queryBuilder.where(`${nameAlias}.isDeleted = :isDeleted`, {
      isDeleted: false,
    });

    // function special for query nearby
    if (query?.nearby) {
      const { lat, lng, radius } = query.nearby;
      queryBuilder.andWhere(
        `(6371 * acos(
              cos(radians(:lat)) *
              cos(radians(user.location->>'$.lat')) *
              cos(radians(user.location->>'$.lng') - radians(:lng)) +
              sin(radians(:lat)) *
              sin(radians(user.location->>'$.lat'))
            )) < :radius`,
        { lat: lat, lng: lng, radius: radius },
      );
    }

    if (query?.where) {
      queryBuilder.andWhere(query.where);
    }

    // function for innerJoin
    if (joinOptions?.innerJoinAndSelect) {
      Object.keys(joinOptions.innerJoinAndSelect).forEach((key) => {
        queryBuilder.innerJoinAndSelect(
          joinOptions.innerJoinAndSelect[key],
          key,
          `${key}.isDeleted = :isDeleted`,
          { isDeleted: false },
        );
      });
    }

    // function for leftJoin
    if (joinOptions?.leftJoinAndSelect) {
      Object.keys(joinOptions.leftJoinAndSelect).forEach((key) => {
        queryBuilder.leftJoinAndSelect(
          joinOptions.leftJoinAndSelect[key],
          key,
          `${key}.isDeleted = :isDeleted`,
          { isDeleted: false },
        );
      });
    }
    // any case special must be query table join
    if (joinOptions?.joinQuery) {
      joinOptions.joinQuery.forEach((item) => {
        queryBuilder.andWhere(item.queryString, item.queryParams);
      });
    }
    // select array filed want to show
    if (query?.select) {
      const querySelect = (query.select as string[]).map((item) => {
        //case field in queryBuilder then ${aliasName}.[key] or full field is ${aliasName}
        //case field of relation joinTable or joinColumn is ${relation abstract name}.[key] or full field is ${relation abstract name}
        return item;
      });
      queryBuilder.select(querySelect);
    }

    //orderBy [fieldName],[orderByType]
    // orderByType : 'asc' | 'desc'
    if (query?.order) {
      Object.keys(query.order).forEach((item) => {
        queryBuilder.addOrderBy(item, query.order[item]);
      });
    }

    //random item
    if (query.random) {
      queryBuilder.addOrderBy('RAND()');
    }

    const count = await queryBuilder.getCount();
    const data = await queryBuilder.take(take).skip(skip).getMany();

    const result = new PaginationResult<T>();
    result.pagination.page = page;
    result.pagination.limit = limit;
    result.pagination.total = count;
    result.pagination.pageCount = Math.ceil(
      result.pagination.total / result.pagination.limit,
    );
    result.data = data;

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

import {
  BaseQueryFilter,
  IBaseQueryFilter,
} from 'src/base/request/base-query-filter';

export class HttpRequestUtil {
  standardizeQueryFilter<T extends IBaseQueryFilter>(queryFilter: T): T {
    const filter = Object.assign(new BaseQueryFilter(), queryFilter);
    filter.page = filter.page ? Number(filter.page) : 0;
    filter.limit = filter.limit ?? false ? Number(filter.limit) : 0;
    filter.condition = {};
    return filter as T;
  }
}

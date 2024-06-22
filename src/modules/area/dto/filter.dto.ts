import { BaseQueryFilter } from 'src/base/request/base-query-filter';

export class FilterAreaDto extends BaseQueryFilter {
  name?: string;
  province?: number;
  district?: number;
  ward?: number;
}

import { BaseQueryFilter } from 'src/base/request/base-query-filter';

export class FilterDiscountDto extends BaseQueryFilter {
  random: boolean;
  userId: string;
  keyword: string;
}

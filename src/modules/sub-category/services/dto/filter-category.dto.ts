import { BaseQueryFilter } from 'src/base/request/base-query-filter';

export class FilterSubCategoryDto extends BaseQueryFilter {
  name: string;
  category: string;
}

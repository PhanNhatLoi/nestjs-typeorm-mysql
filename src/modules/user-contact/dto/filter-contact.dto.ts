import { BaseQueryFilter } from 'src/base/request/base-query-filter';

export class FilterUserContactDto extends BaseQueryFilter {
  userId: number;
  name: string;
}

import { BaseQueryFilter } from 'src/base/request/base-query-filter';

export class FilterUserAccountDto extends BaseQueryFilter {
  name: string;
  category: number;
  'sub-category': number;
  lat?: number;
  lng?: number;
  radius?: number;
  province?: number;
  district?: number;
  ward?: number;
}

export class FilterUserNearby {
  lat: number;
  lng: number;
  radius: number;
}

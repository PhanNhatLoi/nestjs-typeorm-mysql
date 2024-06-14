import { BaseQueryFilter } from 'src/base/request/base-query-filter';
import { USER_ACTION_TYPE } from 'src/shared/constants/global.constants';

export class FilterUserActionDto extends BaseQueryFilter {
  toUserId: number;
  fromUserId: number;
  createdById: number;
  actionType: USER_ACTION_TYPE;
}

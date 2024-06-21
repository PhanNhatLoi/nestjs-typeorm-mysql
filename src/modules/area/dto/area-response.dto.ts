import { BaseEntity } from 'src/base/entities/base-entity';
import { AREA_TYPE } from 'src/shared/constants/global.constants';

export class ResponseAreaDto extends BaseEntity {
  name: string;
  type?: AREA_TYPE;
}

import { IsEmpty, IsString } from 'class-validator';
import { AREA_TYPE } from 'src/shared/constants/global.constants';
import { District } from 'src/typeorm/entities/district.entity';
import { Province } from 'src/typeorm/entities/province.entity';
import { DeepPartial } from 'typeorm';

export class CreateAreaDto {
  @IsString()
  name: string;
  type: AREA_TYPE;
  parentId?: number;
  @IsEmpty()
  province?: DeepPartial<Province>;
  @IsEmpty()
  district?: DeepPartial<District>;

  @IsEmpty()
  isDeleted;
  @IsEmpty()
  id;
}

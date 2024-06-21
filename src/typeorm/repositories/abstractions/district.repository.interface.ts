import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { District } from 'src/typeorm/entities/district.entity';

export interface IDistrictRepository extends IBaseRepository<District> {}

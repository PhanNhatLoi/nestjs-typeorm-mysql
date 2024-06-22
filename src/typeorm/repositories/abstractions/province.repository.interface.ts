import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { Province } from 'src/typeorm/entities/province.entity';

export interface IProvinceRepository extends IBaseRepository<Province> {}

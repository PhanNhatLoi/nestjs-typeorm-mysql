import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { Ward } from 'src/typeorm/entities/ward.entity';

export interface IWardRepository extends IBaseRepository<Ward> {}

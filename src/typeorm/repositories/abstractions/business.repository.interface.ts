import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { Business } from 'src/typeorm/entities/business.entity';

export interface IBusinessRepository extends IBaseRepository<Business> {}

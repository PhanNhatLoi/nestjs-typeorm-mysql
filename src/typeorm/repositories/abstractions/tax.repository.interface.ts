import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { Tax } from 'src/typeorm/entities/tax.entity';

export interface ITaxRepository extends IBaseRepository<Tax> {}

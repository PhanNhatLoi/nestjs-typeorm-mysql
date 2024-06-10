import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { Discount } from 'src/typeorm/entities/discount.entity';

export interface IDiscountRepository extends IBaseRepository<Discount> {}

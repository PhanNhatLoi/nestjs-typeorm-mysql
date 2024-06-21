import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Province } from '../entities/province.entity';
import { IProvinceRepository } from './abstractions/province.repository.interface';

export class ProvinceRepository
  extends BaseRepository<Province>
  implements IProvinceRepository
{
  constructor(
    @InjectRepository(Province, 'identity')
    private readonly _provinceRepository: Repository<Province>,
  ) {
    super(_provinceRepository);
  }
}

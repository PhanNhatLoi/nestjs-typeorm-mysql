import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { District } from '../entities/district.entity';
import { IDistrictRepository } from './abstractions/district.repository.interface';

export class DistrictRepository
  extends BaseRepository<District>
  implements IDistrictRepository
{
  constructor(
    @InjectRepository(District, 'identity')
    private readonly _districtRepository: Repository<District>,
  ) {
    super(_districtRepository);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { OtpCode } from '../entities/otp-code.entity';
import { Repository } from 'typeorm';
import { IOtpCodeRepository } from './abstractions/otp-code.repository.interface';

export class OtpCodeRepository
  extends BaseRepository<OtpCode>
  implements IOtpCodeRepository
{
  constructor(
    @InjectRepository(OtpCode, 'identity')
    private readonly otpCodeRepository: Repository<OtpCode>,
  ) {
    super(otpCodeRepository);
  }
}

import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { OtpCode } from 'src/typeorm/entities/otp-code.entity';

export interface IOtpCodeRepository extends IBaseRepository<OtpCode> {}

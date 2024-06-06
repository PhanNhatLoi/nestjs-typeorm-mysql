import { Result } from 'src/base/response/result';
import { CreateOtpCodeDto } from '../dto/create-otp.dto';
import { OtpCode } from 'src/typeorm/entities/otp-code.entity';
import { FilterOtpCodeDto } from '../dto/filter-otp.dto';

export abstract class IOtpCodeService {
  abstract create(payload: CreateOtpCodeDto): Promise<Result<OtpCode>>;
  abstract get(payload: FilterOtpCodeDto): Promise<Result<OtpCode>>;
  // abstract delete(id: number): Promise<Result<OtpCode>>;
}

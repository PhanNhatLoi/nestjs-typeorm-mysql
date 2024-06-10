import { Result } from 'src/base/response/result';
import { CreateOtpCodeDto } from '../dto/create-otp.dto';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';
import { FilterOtpCodeDto } from '../dto/filter-otp.dto';

export abstract class IUserVerifyService {
  abstract create(payload: CreateOtpCodeDto): Promise<Result<UserVerify>>;
  abstract get(payload: FilterOtpCodeDto): Promise<Result<UserVerify>>;
}

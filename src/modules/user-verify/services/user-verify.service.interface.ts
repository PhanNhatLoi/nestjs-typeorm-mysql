import { Result } from 'src/base/response/result';
import { CreateOtpCodeDto } from '@modules/user-verify/dto/create-otp.dto';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';
import { FilterOtpCodeDto } from '@modules/user-verify/dto/filter-otp.dto';

export abstract class IUserVerifyService {
  abstract create(payload: CreateOtpCodeDto): Promise<Result<UserVerify>>;
  abstract get(payload: FilterOtpCodeDto): Promise<Result<UserVerify>>;
  abstract delete(id: number): Promise<Result<UserVerify>>;
}

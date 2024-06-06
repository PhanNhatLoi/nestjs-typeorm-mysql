import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { IOtpCodeService } from './otp-code.service.interface';
import { IOtpCodeRepository } from 'src/typeorm/repositories/abstractions/otp-code.repository.interface';
import { CreateOtpCodeDto } from '../dto/create-otp.dto';
import { OtpCode } from 'src/typeorm/entities/otp-code.entity';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { FilterOtpCodeDto } from '../dto/filter-otp.dto';

@Injectable()
export class OtpCodeService implements IOtpCodeService {
  constructor(
    @Inject('IOtpCodeRepository')
    private readonly _otpCodeRepository: IOtpCodeRepository,
    private readonly _userAccountService: IUserAccountService,
  ) {}

  async create(payload: CreateOtpCodeDto): Promise<Result<OtpCode>> {
    const user = await this._userAccountService.findParams({
      email: payload.email,
    });
    if (!user.response) throw new Error('User not found');

    let otpCode = await this._otpCodeRepository.findOneByConditions({
      where: {
        user: {
          id: user.response.id,
        },
      },
    });
    const dateNow = new Date();
    if (otpCode) {
      // Update the existing OTP code
      otpCode.code = payload.code;
      otpCode.user = user.response;
      otpCode.createdDate = dateNow;
      otpCode.expDate = new Date(dateNow.getTime() + 3 * 60000);
    } else {
      // Create a new OTP code
      otpCode = this._otpCodeRepository.create({
        code: payload.code,
        user: user.response,
        createdDate: dateNow,
        expDate: new Date(dateNow.getTime() + 3 * 60000),
      });
    }

    return Results.success(await this._otpCodeRepository.save(otpCode));
  }

  async get(payload: FilterOtpCodeDto): Promise<Result<OtpCode>> {
    const result = await this._otpCodeRepository.findOneByConditions({
      where: payload,
    });

    return Results.success(result);
  }
}

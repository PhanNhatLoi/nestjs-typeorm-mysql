import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { IUserVerifyService } from './user-verify.service.interface';
import { IUserVerifyRepository } from 'src/typeorm/repositories/abstractions/user-verify.repository.interface';
import { CreateOtpCodeDto } from '@modules/user-verify/dto/create-otp.dto';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { FilterOtpCodeDto } from '@modules/user-verify/dto/filter-otp.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';

@Injectable()
export class UserVerifyService implements IUserVerifyService {
  constructor(
    @Inject('IUserVerifyRepository')
    private readonly _userVerifyRepository: IUserVerifyRepository,
    private readonly _userAccountService: IUserAccountService,
  ) {}

  async create(payload: CreateOtpCodeDto): Promise<Result<UserVerify>> {
    const user = await this._userAccountService.findParams({
      email: payload.email,
    });
    if (!user.response) throw new Error('User not found');

    let otpCode = await this._userVerifyRepository.findOneByConditions({
      where: {
        user: {
          id: user.response.id,
        },
      },
    });
    const dateNow = new Date();
    if (otpCode) {
      if (new Date(otpCode.expiresDate).getTime() > new Date().getTime()) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.TIME_LIMIT,
          details: 'Limit send otp time, please try later!!',
        });
      }
      // Update the existing OTP code
      otpCode.otp = payload.otp;
      otpCode.user = user.response;
      otpCode.expiresDate = new Date(dateNow.getTime() + 3 * 60000);
    } else {
      // Create a new OTP code
      otpCode = this._userVerifyRepository.create({
        otp: payload.otp,
        user: user.response,
        expiresDate: new Date(dateNow.getTime() + 3 * 60000),
      });
    }

    return Results.success(await this._userVerifyRepository.save(otpCode));
  }

  async get(payload: FilterOtpCodeDto): Promise<Result<UserVerify>> {
    const result = await this._userVerifyRepository.findOneByConditions({
      where: payload,
    });

    return Results.success(result);
  }
  async delete(id: number): Promise<Result<UserVerify>> {
    const otp = await this._userVerifyRepository.findOneById(id);
    if (!otp) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'otp code not found!!!',
      });
    }
    const result = await this._userVerifyRepository.delete(otp);
    return Results.success(result);
  }
}

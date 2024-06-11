import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtServiceConfig } from 'src/configs/config.interface';
import { IAuthService } from 'src/modules/auth/services/auth.service.interface';
import {
  AuthResponseDto,
  AccountInfoResponseDto,
} from 'src/modules/auth/dto/auth-response.dto';
import { TokenPayload } from 'src/modules/auth/interfaces/token.interface';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import {
  access_token_private_key,
  refresh_token_private_key,
} from 'src/shared/constants/jwt.constaint';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { scryptSync } from 'node:crypto';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { SendmailService } from 'src/modules/sendmail/sendmail.service';
import { SignUpTemplate } from 'src/modules/sendmail/template/signUp-html';
import { IUserVerifyService } from 'src/modules/user-verify/services/user-verify.service.interface';
import { VerifyEmailDto } from '@modules/auth/dto/verify-email.dto';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import { ForgetPasswordDto } from '@modules/auth/dto/forget-password.dto';
import { ForgotTemplate } from 'src/modules/sendmail/template/fogotpassword-html';
import { ChangePasswordDto } from '@modules/auth/dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/modules/user-account/services/user-account.service';
import { UpdateInformationDto } from '@modules/auth/dto/update-infor.dto';
import { ICategoryService } from 'src/modules/category/services/category.service.interface';
import { ISubCategoryService } from 'src/modules/sub-category/services/sub-category.service.interface';
import { IUserTaxService } from 'src/modules/user-tax/services/user-tax.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly _jwtServiceConfig: JwtServiceConfig;

  constructor(
    private readonly _userAccountService: IUserAccountService,
    private readonly _jwtService: JwtService,
    private readonly sendMailService: SendmailService,
    private readonly _userVerifyService: IUserVerifyService,
    private readonly _categoryService: ICategoryService,
    private readonly _subCategoryService: ISubCategoryService,
    private readonly _userTaxService: IUserTaxService,
    configService: ConfigService,
  ) {
    this._jwtServiceConfig =
      configService.getOrThrow<JwtServiceConfig>('jwtServiceConfig');
  }
  async getUserIfRefreshTokenMatched(
    id: number,
    refreshToken: string,
  ): Promise<UserAccount> {
    try {
      const user = await this._userAccountService.get(id);
      if (!user.response || !user.response.isLoggedIn) {
        throw new UnauthorizedException({
          message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
          details: 'Unauthorized',
        });
      }
      return user.response;
    } catch (error) {
      throw error;
    }
  }

  async signUp(userDto: SignUpDto): Promise<String> {
    try {
      const userAccount = await this._userAccountService.findParams([
        {
          email: userDto.email,
        },
      ]);

      if (userAccount.response) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.USER_EXISTED,
          details: 'Email exits!!',
        });
      }
      const acceptRoles = Object.keys(USER_ROLE).filter(
        (f) => f !== USER_ROLE.SUPPER_ADMIN,
      );
      if (!acceptRoles.includes(userDto.role)) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.VALIDATION_ERROR,
          details: 'Role invalid!!',
        });
      }
      if (!userAccount.response) {
        await this._userAccountService.create({
          ...userDto,
          role: userDto.role,
          socialLinks: [],
          achievements: [],
          location: {
            lat: 0,
            lng: 0,
          },
          bannerMedia: [],
        });
      }

      const newCode = Math.floor(100000 + Math.random() * 900000).toString(); //generate code 6 digit
      const htmlTemplate = SignUpTemplate(newCode);
      await this.sendMailService.sendmail({
        sendTo: userDto.email,
        subject: '<noreply> This is email verify Email register',
        content: htmlTemplate,
      });
      await this._userVerifyService.create({
        email: userDto.email,
        otp: newCode,
      });
      return 'Register success, please check Email';
    } catch (error) {
      throw error;
    }
  }

  async verifyEmailSignUp(verifyEmailDto: VerifyEmailDto): Promise<String> {
    try {
      const userAccount = await this._userAccountService.findParams({
        email: verifyEmailDto.email,
      });

      if (!userAccount.response) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.USER_NOT_FOUND,
          details: 'Email account not found!!',
        });
      }
      const otpCode = await this._userVerifyService.get({
        user: {
          email: userAccount.response.email,
        },
        otp: verifyEmailDto.otp,
      });

      if (!otpCode.response) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
          details: 'Otp wrong!!',
        });
      }

      if (
        !otpCode.response.expiresDate ||
        new Date(otpCode.response.expiresDate).getTime() < new Date().getTime()
      ) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.VALIDATION_ERROR,
          details: 'Otp exp!!',
        });
      }
      await this._userAccountService.update(userAccount.response.id, {
        emailVerified: true,
      });
      await this._userVerifyService.delete(otpCode.response.id);
      return 'Activated email success';
    } catch (error) {
      throw error;
    }
  }

  async getInfo(id: number): Promise<AccountInfoResponseDto> {
    try {
      const user = await this._userAccountService.findUserWithRelations(id);
      delete user.response.isLoggedIn;
      return user.response;
    } catch (error) {
      throw error;
    }
  }

  async signIn(id: number): Promise<AuthResponseDto> {
    try {
      const accessToken = await this.generateAccessToken({
        id,
      });
      const refreshToken = await this.generateRefreshToken({
        id,
      });

      await this._userAccountService.update(id, {
        isLoggedIn: true,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(
    email: string,
    password: string,
  ): Promise<UserAccount> {
    try {
      const user = await this._userAccountService.findParams({
        email: email,
      });

      if (!user.response) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.USER_NOT_FOUND,
          details: 'User not found!!',
        });
      }

      if (user.response.isDeleted) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.USER_NOT_FOUND,
          details: 'User is Deleted!!',
        });
      }

      if (!user.response.emailVerified) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.USER_NOT_FOUND,
          details: 'Email not activated!!',
        });
      }

      const isMatch = await bcrypt.compare(password, user.response.password);
      if (!isMatch) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
          details: 'Wrong credentials!!',
        });
      }
      delete user.response.password;

      return user.response;
    } catch (error) {
      throw error;
    }
  }

  async storeRefreshToken(id: number, token: string): Promise<void> {
    try {
      const hashedToken = await scryptSync(token, 'salt', 64).toString('hex');
      await this._userAccountService.update(id, { refreshToken: hashedToken });
    } catch (error) {
      throw error;
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return Promise.resolve(
      this._jwtService.sign(payload, {
        algorithm: 'RS256',
        privateKey: access_token_private_key,
        expiresIn: `${this._jwtServiceConfig.accessTokenExpirationTime}`,
      }),
    );
  }

  generateRefreshToken(payload: TokenPayload) {
    return Promise.resolve(
      this._jwtService.sign(payload, {
        algorithm: 'RS256',
        privateKey: refresh_token_private_key,
        expiresIn: `${this._jwtServiceConfig.refreshTokenExpirationTime}`,
      }),
    );
  }

  async forgetPassword(payload: ForgetPasswordDto): Promise<String> {
    try {
      const userAccount = await this._userAccountService.findParams({
        email: payload.email,
      });

      if (
        !userAccount.response ||
        userAccount.response.role === USER_ROLE.SUPPER_ADMIN
      ) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.USER_NOT_FOUND,
          details: 'User not found!!',
        });
      }

      const newCode = Math.floor(100000 + Math.random() * 900000).toString(); //generate code 6 digit
      const htmlTemplate = ForgotTemplate(newCode);
      await this.sendMailService.sendmail({
        sendTo: payload.email,
        subject: '<noreply> This is email verify Email forgotPassword',
        content: htmlTemplate,
      });
      await this._userVerifyService.create({
        email: payload.email,
        otp: newCode,
      });

      return 'An otp email has been sent to your email, please check';
    } catch (error) {
      throw error;
    }
  }

  async changePassword(payload: ChangePasswordDto): Promise<String> {
    const userAccount = await this._userAccountService.findParams({
      email: payload.email,
    });

    if (!userAccount.response) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND,
        details: 'User not found!!',
      });
    }

    const otpCode = await this._userVerifyService.get({
      user: {
        email: payload.email,
      },
      otp: payload.otpCode,
    });

    if (!otpCode.response) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
        details: 'Otp wrong!!',
      });
    }

    if (
      !otpCode.response.expiresDate ||
      new Date(otpCode.response.expiresDate).getTime() < new Date().getTime()
    ) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.VALIDATION_ERROR,
        details: 'Otp exp!!',
      });
    }

    const newPasswordHash = await bcrypt.hash(
      payload.newPassword,
      saltOrRounds,
    );
    await this._userAccountService.update(userAccount.response.id, {
      password: newPasswordHash,
    });

    return 'Change password successfully';
  }

  async logout(id: number): Promise<string> {
    await this._userAccountService.update(id, {
      isLoggedIn: false,
    });
    return 'Logout success';
  }

  async updateInformation(
    id: number,
    payload: UpdateInformationDto,
  ): Promise<AccountInfoResponseDto> {
    try {
      const user = await this.getInfo(id);
      const categories = await this._categoryService.getByIds(
        payload.categories || [],
      );
      const subCategories = await this._subCategoryService.getByIds(
        payload.subCategories || [],
      );

      if (user.tax) {
        await this._userTaxService.update(user.tax.id, {
          ...user.tax,
          ...payload.tax,
        });
      } else {
        const newTax = await this._userTaxService.create({
          businessType: '',
          address: '',
          email: 'string',
          taxCode: 'string',
          photoLicense: [],
          photoCatholic: [],
          ...payload.tax,
          modifiedBy: user,
          createdBy: user,
        });

        user.tax = newTax.response;
      }

      await this._userAccountService.update(id, {
        ...user,
        ...payload,
        categories: (payload.categories && categories.response) || undefined,
        subCategories:
          (payload.subCategories && subCategories.response) || undefined,
        modifiedDate: new Date(),
        // tax: tax,
      });

      return await this.getInfo(id);
    } catch (error) {
      throw error;
    }
  }
}

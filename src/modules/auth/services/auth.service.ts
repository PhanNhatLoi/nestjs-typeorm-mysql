import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
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
import { SignUpDto } from '../dto/sign-up.dto';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { SendmailService } from 'src/modules/sendmail/sendmail.service';
import { SignUpTemplate } from 'src/modules/sendmail/template/signUp-html';
import { IUserVerifyService } from 'src/modules/user-verify/services/user-verify.service.interface';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { USER_ROLE } from 'src/shared/constants/global.constants';

@Injectable()
export class AuthService implements IAuthService {
  private readonly _jwtServiceConfig: JwtServiceConfig;

  constructor(
    private readonly _userAccountService: IUserAccountService,
    private readonly _jwtService: JwtService,
    private readonly sendMailService: SendmailService,
    private readonly _userVerifyService: IUserVerifyService,
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
      if (!user) {
        throw new UnauthorizedException({
          message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
          details: 'Unauthorized',
        });
      }
      // await this.verifyPlainContentWithHashedContent(
      //   refreshToken,
      //   user.refreshToken,
      // );
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
        code: verifyEmailDto.otp,
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
      return 'Activated email success';
    } catch (error) {
      throw error;
    }
  }

  async getInfo(id: number): Promise<AccountInfoResponseDto> {
    try {
      const user = await this._userAccountService.get(id);
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
      // await this.storeRefreshToken(id, refreshToken);
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

      const hash = crypto.scryptSync(password, 'salt', 32).toString('hex');
      if (hash !== user.response.password) {
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
}

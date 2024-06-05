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
  SignUpResponseDto,
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

@Injectable()
export class AuthService implements IAuthService {
  private readonly _jwtServiceConfig: JwtServiceConfig;

  constructor(
    private readonly _userAccountService: IUserAccountService,
    private readonly _jwtService: JwtService,
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

  async signUp(userDto: SignUpDto): Promise<SignUpResponseDto> {
    try {
      const user = await this._userAccountService.create({
        ...userDto,
      });
      return {
        id: user.response.id,
      };
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
        isDeleted: false,
      });

      // if (!user.response.roles.includes(USER_ROLE.PARTNER)) {
      //   throw new BadRequestException();
      // }
      // await this.verifyPassword(password, user.response.password);

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
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
        details: 'Wrong credentials!!!',
      });
    }
  }

  private async verifyPassword(passwordCompare: string, password: string) {
    const passwordHash = crypto
      .createHash('md5')
      .update(passwordCompare, 'utf8')
      .digest('hex')
      .toUpperCase();

    if (passwordHash !== password) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.CONTENT_NOT_MATCH,
        details: 'Content not match!!',
      });
    }
  }

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ) {
    const isMatching =
      (await scryptSync(plainText, 'salt', 64).toString('hex')) === hashedText;

    if (!isMatching) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.CONTENT_NOT_MATCH,
        details: 'Content not match!!',
      });
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
        expiresIn: `${this._jwtServiceConfig.accessTokenExpirationTime}s`,
      }),
    );
  }

  generateRefreshToken(payload: TokenPayload) {
    return Promise.resolve(
      this._jwtService.sign(payload, {
        algorithm: 'RS256',
        privateKey: refresh_token_private_key,
        expiresIn: `${this._jwtServiceConfig.refreshTokenExpirationTime}s`,
      }),
    );
  }
}

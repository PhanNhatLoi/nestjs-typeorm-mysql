import {
  AuthResponseDto,
  AccountInfoResponseDto,
} from 'src/modules/auth/dto/auth-response.dto';
import { TokenPayload } from 'src/modules/auth/interfaces/token.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { VerifyEmailDto } from '@modules/auth/dto/verify-email.dto';
import {
  ChangePasswordDto,
  verifyChangePasswordDto,
} from '@modules/auth/dto/change-password.dto';
import { UpdateInformationDto } from '@modules/auth/dto/update-infor.dto';
import { SendOtpDto } from '../dto/send-otp.dto';

export abstract class IAuthService {
  abstract getAuthenticatedUser(
    email: string,
    password: string,
  ): Promise<UserAccount>;
  abstract getInfo(id: number): Promise<AccountInfoResponseDto>;
  abstract signIn(id: number): Promise<AuthResponseDto>;
  abstract verifyEmailSignUp(payload: VerifyEmailDto): Promise<String>;
  abstract signUp(user: SignUpDto): Promise<String>;
  abstract sendOtp(
    payload: SendOtpDto,
    type: 'register' | 'resetPassword',
  ): Promise<String>;
  abstract changePassword(payload: ChangePasswordDto): Promise<String>;
  abstract getUserIfRefreshTokenMatched(
    id: number,
    refreshToken: string,
  ): Promise<UserAccount>;
  abstract generateAccessToken(payload: TokenPayload): Promise<string>;
  abstract generateRefreshToken(payload: TokenPayload): Promise<string>;
  abstract logout(id: number): Promise<string>;
  abstract updateInformation(
    id: number,
    payload: UpdateInformationDto,
  ): Promise<AccountInfoResponseDto>;
  abstract verifyChangePassword(
    payload: verifyChangePasswordDto,
  ): Promise<{ accessKey: string }>;
  abstract validateToken(token: string): Promise<UserAccount>;
}

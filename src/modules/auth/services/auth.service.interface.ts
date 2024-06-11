import {
  AuthResponseDto,
  AccountInfoResponseDto,
} from 'src/modules/auth/dto/auth-response.dto';
import { TokenPayload } from 'src/modules/auth/interfaces/token.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { SignUpDto } from '../dto/sign-up.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateInformationDto } from '../dto/update-infor.dto';

export abstract class IAuthService {
  abstract getAuthenticatedUser(
    email: string,
    password: string,
  ): Promise<UserAccount>;
  abstract getInfo(id: number): Promise<AccountInfoResponseDto>;
  abstract signIn(id: number): Promise<AuthResponseDto>;
  abstract verifyEmailSignUp(payload: VerifyEmailDto): Promise<String>;
  abstract signUp(user: SignUpDto): Promise<String>;
  abstract forgetPassword(payload: ForgetPasswordDto): Promise<String>;
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
}

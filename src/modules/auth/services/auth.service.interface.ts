import {
  AuthResponseDto,
  AccountInfoResponseDto,
} from 'src/modules/auth/dto/auth-response.dto';
import { TokenPayload } from 'src/modules/auth/interfaces/token.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { SignUpDto } from '../dto/sign-up.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';

export abstract class IAuthService {
  abstract getAuthenticatedUser(
    email: string,
    password: string,
  ): Promise<UserAccount>;
  abstract getInfo(id: number): Promise<AccountInfoResponseDto>;
  abstract signIn(id: number): Promise<AuthResponseDto>;
  abstract verifyEmailSignUp(payload: VerifyEmailDto): Promise<String>;
  abstract signUp(user: SignUpDto): Promise<String>;
  abstract getUserIfRefreshTokenMatched(
    id: number,
    refreshToken: string,
  ): Promise<UserAccount>;
  abstract generateAccessToken(payload: TokenPayload): Promise<string>;
  abstract generateRefreshToken(payload: TokenPayload): Promise<string>;
}

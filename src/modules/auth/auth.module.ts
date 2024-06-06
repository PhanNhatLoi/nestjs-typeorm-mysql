import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAuthService } from 'src/modules/auth/services/auth.service.interface';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { JwtAccessTokenStrategy } from 'src/modules/auth/strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from 'src/modules/auth/strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';
import { SendmailService } from '../sendmail/sendmail.service';
import { IOtpCodeService } from '../otp-code/services/otp-code.service.interface';
import { OtpCodeService } from '../otp-code/services/otp-code-account.service';
import { OtpCode } from 'src/typeorm/entities/otp-code.entity';
import { OtpCodeRepository } from 'src/typeorm/repositories/otp-code.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserAccount, OtpCode], 'identity'),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
    {
      provide: IOtpCodeService,
      useClass: OtpCodeService,
    },
    {
      provide: 'IOtpCodeRepository',
      useClass: OtpCodeRepository,
    },
    {
      provide: 'IUserAccountRepository',
      useClass: UserAccountRepository,
    },
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    SendmailService,
  ],
})
export class AuthModule {}

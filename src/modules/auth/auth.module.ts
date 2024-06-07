import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAuthService } from 'src/modules/auth/services/auth.service.interface';
import { AdminController } from 'src/modules/auth/admin.controller';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { JwtAccessTokenStrategy } from 'src/modules/auth/strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from 'src/modules/auth/strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';
import { SendmailService } from '../sendmail/sendmail.service';
import { IUserVerifyService } from '../user-verify/services/user-verify.service.interface';
import { UserVerifyService } from '../user-verify/services/user-verify.service';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';
import { UserVerifyRepository } from 'src/typeorm/repositories/user-verify.repository';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserAccount, UserVerify], 'identity'),
  ],
  controllers: [AdminController, AuthController],
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
      provide: IUserVerifyService,
      useClass: UserVerifyService,
    },
    {
      provide: 'IUserVerifyRepository',
      useClass: UserVerifyRepository,
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

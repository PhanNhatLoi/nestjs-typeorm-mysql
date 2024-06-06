import { Module } from '@nestjs/common';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { IOtpCodeService } from './services/otp-code.service.interface';
import { OtpCodeService } from './services/otp-code-account.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
    {
      provide: IOtpCodeService,
      useClass: OtpCodeService,
    },
  ],
})
export class UserAccountModule {}

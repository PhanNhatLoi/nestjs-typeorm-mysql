import { Module } from '@nestjs/common';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { IUserVerifyService } from './services/user-verify.service.interface';
import { UserVerifyService } from './services/user-verify.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
    {
      provide: IUserVerifyService,
      useClass: UserVerifyService,
    },
  ],
})
export class UserAccountModule {}

import { Module } from '@nestjs/common';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { UserAccountController } from 'src/modules/user-account/user-account.controller';

@Module({
  imports: [],
  controllers: [UserAccountController],
  providers: [
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
  ],
})
export class UserAccountModule {}

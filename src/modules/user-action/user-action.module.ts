import { Module } from '@nestjs/common';
import { IUserActionService } from './services/user-action.service.interface';
import { UserActionService } from './services/user-action.service';
import { IUserAccountService } from '@modules/user-account/services/user-account.service.interface';
import { UserAccountService } from '@modules/user-account/services/user-account.service';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IUserActionService,
      useClass: UserActionService,
    },
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
  ],
})
export class UserActionModule {}

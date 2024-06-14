import { Module } from '@nestjs/common';
import { IUserActionService } from './services/user-action.service.interface';
import { UserActionService } from './services/user-action.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IUserActionService,
      useClass: UserActionService,
    },
  ],
})
export class UserActionModule {}

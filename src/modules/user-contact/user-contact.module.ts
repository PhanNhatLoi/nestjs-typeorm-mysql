import { Module } from '@nestjs/common';
import { UserContactService } from './services/user-contact.service';
import { IUserContactService } from './services/user-contact.service.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IUserContactService,
      useClass: UserContactService,
    },
  ],
})
export class UserContactModule {}

import { Module } from '@nestjs/common';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { PartnerController } from './partner.controller';
import { IPartnerService } from './services/partner.service.interface';
import { PartnerService } from './services/partner.service';
import { IUserActionService } from '@modules/user-action/services/user-action.service.interface';
import { UserActionService } from '@modules/user-action/services/user-action.service';
import { IUserContactService } from '@modules/user-contact/services/user-contact.service.interface';
import { UserContactService } from '@modules/user-contact/services/user-contact.service';

@Module({
  imports: [],
  controllers: [PartnerController],
  providers: [
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
    {
      provide: IPartnerService,
      useClass: PartnerService,
    },
    {
      provide: IUserActionService,
      useClass: UserActionService,
    },
    {
      provide: IUserContactService,
      useClass: UserContactService,
    },
  ],
})
export class PartnerModule {}

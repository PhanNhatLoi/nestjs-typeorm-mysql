import { Module } from '@nestjs/common';
import { IDiscountService } from './services/discount.service.interface';
import { DiscountService } from './services/discount.service';
import { DiscountController } from './discount.controller';
import { IUserAccountService } from '@modules/user-account/services/user-account.service.interface';
import { UserAccountService } from '@modules/user-account/services/user-account.service';

@Module({
  imports: [],
  controllers: [DiscountController],
  providers: [
    {
      provide: IDiscountService,
      useClass: DiscountService,
    },
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
  ],
})
export class DiscountModule {}

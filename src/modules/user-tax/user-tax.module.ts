import { Module } from '@nestjs/common';
import { UserTaxService } from './services/user-tax.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserTaxService],
})
export class UserTaxModule {}

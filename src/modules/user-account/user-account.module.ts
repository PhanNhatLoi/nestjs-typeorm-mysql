import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAddress } from 'src/typeorm/entities/user-address.entity';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount, UserAddress], 'identity')],
  controllers: [],
  providers: [
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
    {
      provide: 'IUserAccountRepository',
      useClass: UserAccountRepository,
    },
  ],
})
export class UserAccountModule {}

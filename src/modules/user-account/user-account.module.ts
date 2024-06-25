import { CategoryService } from '@modules/category/services/category.service';
import { ICategoryService } from '@modules/category/services/category.service.interface';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { Category } from 'src/typeorm/entities/category.entity';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAddress } from 'src/typeorm/entities/user-address.entity';
import { CategoryRepository } from 'src/typeorm/repositories/category.repository';
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

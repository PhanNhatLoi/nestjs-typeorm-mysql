import { DynamicModule, Module, Scope } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';
import { UserVerify } from '../entities/user-verify.entity';
import { UserVerifyRepository } from './user-verify.repository';
import { BusinessRepository } from './business.repository';
import { Business } from '../entities/business.entity';
import { TaxRepository } from './tax.repository';
import { Tax } from '../entities/tax.entity';
import { UserAction } from '../entities/user-action.entity';
import { UserActionRepository } from './user-action.repository';
import { Discount } from '../entities/discount.entity';
import { DiscountRepository } from './discount.repository';

@Module({
  providers: [],
  imports: [],
  exports: [],
})
export class RepositoryModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const providers = [
      {
        provide: 'IUserAccountRepository',
        useClass: UserAccountRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IUserVerifyRepository',
        useClass: UserVerifyRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IBusinessRepository',
        useClass: BusinessRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'ITaxInformationRepository',
        useClass: TaxRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IUserActionRepository',
        useClass: UserActionRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IDiscountRepository',
        useClass: DiscountRepository,
        scope: Scope.REQUEST,
      },
    ];

    const imports = [
      TypeOrmModule.forFeature(
        [UserAccount, UserVerify, Business, Tax, UserAction, Discount],
        'identity',
      ),
    ];

    const exports = Object.assign([], providers);

    return {
      imports: imports,
      global: options?.isGlobal || true,
      module: RepositoryModule,
      providers: providers,
      exports: exports,
    };
  }
}

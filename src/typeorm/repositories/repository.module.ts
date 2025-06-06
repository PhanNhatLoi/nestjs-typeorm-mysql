import { DynamicModule, Module, Scope } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';
import { UserVerifyRepository } from 'src/typeorm/repositories/user-verify.repository';
import { TaxRepository } from 'src/typeorm/repositories/tax.repository';
import { Tax } from 'src/typeorm/entities/user-tax.entity';
import { UserAction } from 'src/typeorm/entities/user-action.entity';
import { UserActionRepository } from 'src/typeorm/repositories/user-action.repository';
import { Discount } from 'src/typeorm/entities/discount.entity';
import { DiscountRepository } from 'src/typeorm/repositories/discount.repository';
import { Category } from 'src/typeorm/entities/category.entity';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';
import { CategoryRepository } from 'src/typeorm/repositories/category.repository';
import { SubCategoryRepository } from 'src/typeorm/repositories/sub-category.repository';
import { UserContact } from '../entities/user-contact.entity';
import { UserContactRepository } from './user-contact.repository';
import { LanguageRepository } from './language.repository';
import { Language } from '../entities/language.entity';
import { ProvinceRepository } from './province.repository';
import { Province } from '../entities/province.entity';
import { District } from '../entities/district.entity';
import { Ward } from '../entities/ward.entity';
import { DistrictRepository } from './district.repository';
import { WardRepository } from './ward.repository';
import { UserAddress } from '../entities/user-address.entity';
import { UserAddressRepository } from './user-address.repository';

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
        provide: 'ITaxRepository',
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
      {
        provide: 'ICategoryRepository',
        useClass: CategoryRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'ISubCategoryRepository',
        useClass: SubCategoryRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IUserContactRepository',
        useClass: UserContactRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'ILanguageRepository',
        useClass: LanguageRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IProvinceRepository',
        useClass: ProvinceRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IDistrictRepository',
        useClass: DistrictRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IWardRepository',
        useClass: WardRepository,
        scope: Scope.REQUEST,
      },
      {
        provide: 'IUserAddressRepository',
        useClass: UserAddressRepository,
        scope: Scope.REQUEST,
      },
    ];

    const imports = [
      TypeOrmModule.forFeature(
        [
          UserAccount,
          UserVerify,
          Tax,
          UserAction,
          Discount,
          Category,
          SubCategory,
          UserContact,
          Language,
          Province,
          District,
          Ward,
          UserAddress,
        ],
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

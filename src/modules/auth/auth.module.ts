import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAuthService } from 'src/modules/auth/services/auth.service.interface';
import { AdminController } from 'src/modules/auth/admin.controller';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { JwtAccessTokenStrategy } from 'src/modules/auth/strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from 'src/modules/auth/strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserAccountService } from 'src/modules/user-account/services/user-account.service';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';
import { SendmailService } from 'src/modules/sendmail/sendmail.service';
import { IUserVerifyService } from 'src/modules/user-verify/services/user-verify.service.interface';
import { UserVerifyService } from 'src/modules/user-verify/services/user-verify.service';
import { UserVerify } from 'src/typeorm/entities/user-verify.entity';
import { UserVerifyRepository } from 'src/typeorm/repositories/user-verify.repository';
import { AuthController } from './auth.controller';
import { CategoryService } from 'src/modules/category/services/category.service';
import { ICategoryService } from 'src/modules/category/services/category.service.interface';
import { SubCategoryService } from 'src/modules/sub-category/services/sub-category.service';
import { ISubCategoryService } from 'src/modules/sub-category/services/sub-category.service.interface';
import { IUserTaxService } from 'src/modules/user-tax/services/user-tax.service.interface';
import { UserTaxService } from 'src/modules/user-tax/services/user-tax.service';
import { Tax } from 'src/typeorm/entities/user-tax.entity';
import { CategoryRepository } from 'src/typeorm/repositories/category.repository';
import { Category } from 'src/typeorm/entities/category.entity';
import { SubCategoryRepository } from 'src/typeorm/repositories/sub-category.repository';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';
import { TaxRepository } from 'src/typeorm/repositories/tax.repository';
import { UserAddressRepository } from 'src/typeorm/repositories/user-address.repository';
import { UserAddress } from 'src/typeorm/entities/user-address.entity';
import { AreaService } from '@modules/area/services/area.service';
import { IAreaService } from '@modules/area/services/area.service.interface';
import { WardRepository } from 'src/typeorm/repositories/ward.repository';
import { ProvinceRepository } from 'src/typeorm/repositories/province.repository';
import { DistrictRepository } from 'src/typeorm/repositories/district.repository';
import { Ward } from 'src/typeorm/entities/ward.entity';
import { District } from 'src/typeorm/entities/district.entity';
import { Province } from 'src/typeorm/entities/province.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature(
      [
        UserAccount,
        UserVerify,
        Category,
        SubCategory,
        Tax,
        UserAddress,
        Ward,
        District,
        Province,
      ],
      'identity',
    ),
  ],
  controllers: [AdminController, AuthController],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
    {
      provide: IUserVerifyService,
      useClass: UserVerifyService,
    },
    {
      provide: ICategoryService,
      useClass: CategoryService,
    },
    {
      provide: ISubCategoryService,
      useClass: SubCategoryService,
    },
    {
      provide: IUserTaxService,
      useClass: UserTaxService,
    },
    {
      provide: IAreaService,
      useClass: AreaService,
    },
    {
      provide: 'IWardRepository',
      useClass: WardRepository,
    },
    {
      provide: 'IDistrictRepository',
      useClass: DistrictRepository,
    },
    {
      provide: 'IProvinceRepository',
      useClass: ProvinceRepository,
    },
    {
      provide: 'ITaxRepository',
      useClass: TaxRepository,
    },
    {
      provide: 'ISubCategoryRepository',
      useClass: SubCategoryRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    {
      provide: 'IUserVerifyRepository',
      useClass: UserVerifyRepository,
    },
    {
      provide: 'IUserAccountRepository',
      useClass: UserAccountRepository,
    },
    {
      provide: 'IUserAddressRepository',
      useClass: UserAddressRepository,
    },
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    SendmailService,
  ],
})
export class AuthModule {}

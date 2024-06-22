import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/configs/configuration.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { DbContextModule } from 'src/typeorm/db-context.module';
import { RepositoryModule } from 'src/typeorm/repositories/repository.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { SendmailModule } from '@modules/sendmail/sendmail.module';
import { UploadFileModule } from '@modules/upload-file/upload-file.module';
import { CategoryModule } from '@modules/category/category.module';
import { SubCategoryModule } from '@modules/sub-category/sub-category.module';
import { UserTaxModule } from '@modules/user-tax/user-tax.module';
import { PartnerModule } from '@modules/partner/partner.module';
import { UserActionModule } from '@modules/user-action/user-action.module';
import { UserContactModule } from '@modules/user-contact/user-contact.module';
import { LanguageModule } from '@modules/language/language.module';
import { SettingsModule } from '@modules/settings/settings.module';
import { DiscountModule } from '@modules/discount/discount.module';
import { AreaModule } from '@modules/area/area.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
      load: [GLOBAL_CONFIG],
    }),
    SharedModule.forRoot({ isGlobal: true }),
    RepositoryModule.forRoot({ isGlobal: true }),
    DbContextModule,
    AuthModule,
    SendmailModule,
    UploadFileModule,
    CategoryModule,
    SubCategoryModule,
    UserTaxModule,
    PartnerModule,
    UserActionModule,
    UserContactModule,
    LanguageModule,
    SettingsModule,
    DiscountModule,
    AreaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

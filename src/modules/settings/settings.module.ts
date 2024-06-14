import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { ISettingsService } from './services/settings.service.interface';
import { SettingsService } from './services/settings.service';
import { LanguageService } from '@modules/language/services/language.service';
import { ILanguageService } from '@modules/language/services/language.service.interface';
import { IUserActionService } from '@modules/user-action/services/user-action.service.interface';
import { UserActionService } from '@modules/user-action/services/user-action.service';

@Module({
  imports: [],
  controllers: [SettingsController],
  providers: [
    {
      provide: ISettingsService,
      useClass: SettingsService,
    },
    {
      provide: ILanguageService,
      useClass: LanguageService,
    },
    {
      provide: IUserActionService,
      useClass: UserActionService,
    },
  ],
})
export class SettingsModule {}

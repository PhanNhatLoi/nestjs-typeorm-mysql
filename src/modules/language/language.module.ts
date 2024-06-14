import { Module } from '@nestjs/common';
import { LanguageService } from './services/language.service';
import { ILanguageService } from './services/language.service.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: ILanguageService,
      useClass: LanguageService,
    },
  ],
})
export class LanguageModule {}

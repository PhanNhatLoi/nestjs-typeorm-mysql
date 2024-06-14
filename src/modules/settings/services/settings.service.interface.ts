import { Result } from 'src/base/response/result';
import { Language } from 'src/typeorm/entities/language.entity';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { CreateLanguageDto } from '@modules/language/services/dto/create-language.dto';
import { UpdateLanguageDto } from '@modules/language/services/dto/update-language.dto';

export abstract class ISettingsService {
  abstract createLanguage(
    user: DeepPartial<UserAccount>,
    payload: CreateLanguageDto,
  ): Promise<Result<Language>>;
  abstract updateLanguage(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: UpdateLanguageDto,
  ): Promise<Result<Language>>;
  abstract deleteLanguage(id: number): Promise<Result<Boolean>>;
  abstract getLanguages(): Promise<Result<Language[]>>;
  abstract getStatistics(id: number): Promise<Result<any>>;
}

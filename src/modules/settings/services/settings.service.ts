import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ILanguageRepository } from 'src/typeorm/repositories/abstractions/language.repository.interface';
import { Result } from 'src/base/response/result';
import { Language } from 'src/typeorm/entities/language.entity';
import { Results } from 'src/base/response/result-builder';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { CreateLanguageDto } from '@modules/language/services/dto/create-language.dto';
import { UpdateLanguageDto } from '@modules/language/services/dto/update-language.dto';
import { ISettingsService } from './settings.service.interface';
import { ILanguageService } from '@modules/language/services/language.service.interface';
import { IUserActionService } from '@modules/user-action/services/user-action.service.interface';
import { USER_ACTION_TYPE } from 'src/shared/constants/global.constants';

@Injectable()
export class SettingsService implements ISettingsService {
  constructor(
    private readonly _languageService: ILanguageService,
    private readonly _userActionService: IUserActionService,
  ) {}

  async getLanguages(): Promise<Result<Language[]>> {
    return await this._languageService.gets();
  }
  async createLanguage(
    user: DeepPartial<UserAccount>,
    payload: CreateLanguageDto,
  ): Promise<Result<Language>> {
    return await this._languageService.create(user, payload);
  }

  async updateLanguage(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: UpdateLanguageDto,
  ): Promise<Result<Language>> {
    return await this._languageService.update(user, id, payload);
  }
  async deleteLanguage(id: number): Promise<Result<Boolean>> {
    return await this._languageService.delete(id);
  }
  async getStatistics(id: number): Promise<Result<any>> {
    const result = await this._userActionService.countByActionType(id);

    return result;
  }
}

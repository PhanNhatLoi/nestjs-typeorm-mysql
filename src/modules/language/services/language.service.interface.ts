import { Result } from 'src/base/response/result';
import { Language } from 'src/typeorm/entities/language.entity';
import { CreateLanguageDto } from './dto/create-language.dto';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';

export abstract class ILanguageService {
  abstract create(
    user: DeepPartial<UserAccount>,
    payload: CreateLanguageDto,
  ): Promise<Result<Language>>;
  abstract get(id: number): Promise<Result<Language>>;
  abstract update(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: CreateLanguageDto,
  ): Promise<Result<Language>>;
  abstract delete(id: number): Promise<Result<Boolean>>;
  abstract gets(): Promise<Result<Language[]>>;
}

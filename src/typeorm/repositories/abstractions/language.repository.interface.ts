import { IBaseRepository } from 'src/base/repositories/base-repository.interface';
import { Language } from 'src/typeorm/entities/language.entity';

export interface ILanguageRepository extends IBaseRepository<Language> {}

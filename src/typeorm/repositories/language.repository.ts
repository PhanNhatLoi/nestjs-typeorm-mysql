import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/base/repositories/base-repository';
import { Repository } from 'typeorm';
import { Category } from 'src/typeorm/entities/category.entity';
import { Language } from '../entities/language.entity';
import { ILanguageRepository } from './abstractions/language.repository.interface';

export class LanguageRepository
  extends BaseRepository<Language>
  implements ILanguageRepository
{
  constructor(
    @InjectRepository(Language, 'identity')
    private readonly languageRepository: Repository<Language>,
  ) {
    super(languageRepository);
  }
}

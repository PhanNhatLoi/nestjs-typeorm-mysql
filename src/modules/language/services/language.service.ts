import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ILanguageRepository } from 'src/typeorm/repositories/abstractions/language.repository.interface';
import { ILanguageService } from './language.service.interface';
import { Result } from 'src/base/response/result';
import { Language } from 'src/typeorm/entities/language.entity';
import { Results } from 'src/base/response/result-builder';
import { CreateLanguageDto } from './dto/create-language.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';
import { DeepPartial } from 'typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';

@Injectable()
export class LanguageService implements ILanguageService {
  constructor(
    @Inject('ILanguageRepository')
    private readonly _languageRepository: ILanguageRepository,
  ) {}

  async gets(): Promise<Result<Language[]>> {
    return Results.success(
      await this._languageRepository.findAll({
        where: {
          isDeleted: false,
        },
      }),
    );
  }
  async get(id: number): Promise<Result<Language>> {
    const result = await this._languageRepository.findOneById(id);
    if (!result) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.NOT_FOUND,
        details: 'language not found!!',
      });
    }
    return Results.success(result);
  }
  async create(
    user: DeepPartial<UserAccount>,
    payload: CreateLanguageDto,
  ): Promise<Result<Language>> {
    const checkUnique = await this._languageRepository.findOneByConditions({
      where: [
        {
          name: payload.name,
        },
        {
          sortName: payload.sortName,
        },
      ],
    });
    if (checkUnique) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: 'language name or sort name exits!!',
      });
    }
    const result = await this._languageRepository.save({
      dataSource: {},
      ...payload,
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdBy: user,
      modifiedBy: user,
    });

    return Results.success((await this.get(result.id)).response);
  }

  async update(
    user: DeepPartial<UserAccount>,
    id: number,
    payload: CreateLanguageDto,
  ): Promise<Result<Language>> {
    const result = await this.get(id);
    const checkUnique = await this._languageRepository.findAll({
      where: [
        {
          name: payload.name,
        },
        {
          sortName: payload.sortName,
        },
      ],
    });
    if (checkUnique.length > 0) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.ALREADY_EXISTS,
        details: 'language name or sort name exits!!',
      });
    }
    await this._languageRepository.save({
      ...result.response,
      ...payload,
      modifiedDate: new Date(),
      modifiedBy: user,
    });
    return Results.success((await this.get(id)).response);
  }
  async delete(id: number): Promise<Result<Boolean>> {
    const result = await this.get(id);
    await this._languageRepository.delete(result.response);
    return Results.success(true);
  }
}

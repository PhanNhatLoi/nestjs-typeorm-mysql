import { Injectable } from '@nestjs/common';
import { IGenerateDbService } from './generate-db.service.interface';
import { Result } from 'src/base/response/result';
import { Results } from 'src/base/response/result-builder';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { USER_ROLE } from 'src/shared/constants/global.constants';

@Injectable()
export class GenerateDbService implements IGenerateDbService {
  constructor(private readonly _userAccountRepository: IUserAccountService) {}

  async generate(): Promise<Result<String>> {
    try {
      await this._userAccountRepository.create({
        email: 'admin@myzens.net',
        phone: '',
        password: '12345678',
        socialLinks: [],
        achievements: [],
        role: USER_ROLE.SUPPER_ADMIN,
      });
      return Results.success('generate init database');
    } catch (error) {
      console.log(error);
    }
  }
}

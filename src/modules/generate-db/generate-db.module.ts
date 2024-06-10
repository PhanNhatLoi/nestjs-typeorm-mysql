import { Module } from '@nestjs/common';
import { GenerateDbService } from './services/generate-db.service';
import { UserAccountService } from '../user-account/services/user-account.service';
import { IUserAccountService } from '../user-account/services/user-account.service.interface';
import { IGenerateDbService } from './services/generate-db.service.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount], 'identity')],
  controllers: [],
  providers: [
    {
      provide: IGenerateDbService,
      useClass: GenerateDbService,
    },
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
  ],
})
export class GenerateDbModule {}

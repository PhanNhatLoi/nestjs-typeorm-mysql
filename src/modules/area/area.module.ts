import { Module } from '@nestjs/common';
import { AreaService } from './services/area.service';
import { IAreaService } from './services/area.service.interface';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from 'src/typeorm/entities/province.entity';
import { ProvinceRepository } from 'src/typeorm/repositories/province.repository';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Province, UserAccount], 'identity')],
  controllers: [AreaController],
  providers: [
    {
      provide: IAreaService,
      useClass: AreaService,
    },
    {
      provide: 'IProvinceRepository',
      useClass: ProvinceRepository,
    },
    {
      provide: 'IUserAccountRepository',
      useClass: UserAccountRepository,
    },
  ],
})
export class AreaModule {}

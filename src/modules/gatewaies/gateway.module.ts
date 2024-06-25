import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { IUserAccountService } from '@modules/user-account/services/user-account.service.interface';
import { UserAccountService } from '@modules/user-account/services/user-account.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [],
  providers: [
    {
      provide: IUserAccountService,
      useClass: UserAccountService,
    },
    AppGateway,
  ],
})
export class GatewayModules {}

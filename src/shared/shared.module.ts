import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { IdentityService } from 'src/shared/services/identity.service';
import { IIdentityService } from 'src/shared/services/identity.service.interface';

@Module({
  imports: [],
  providers: [],
})
export class SharedModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const providers = [
      {
        provide: IIdentityService,
        useClass: IdentityService,
      },
    ];

    const exports = Object.assign([], providers);

    return {
      global: options?.isGlobal || true,
      module: SharedModule,
      providers: providers,
      exports: exports,
    };
  }
}

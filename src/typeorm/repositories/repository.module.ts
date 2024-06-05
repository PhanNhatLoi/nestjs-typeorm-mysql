import { DynamicModule, Module, Scope } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { UserAccountRepository } from 'src/typeorm/repositories/user-account.repository';

@Module({
  providers: [],
  imports: [],
  exports: [],
})
export class RepositoryModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const providers = [
      {
        provide: 'IUserAccountRepository',
        useClass: UserAccountRepository,
        scope: Scope.REQUEST,
      }
    ];

    const imports = [
      TypeOrmModule.forFeature([UserAccount], 'identity'),
    ];

    const exports = Object.assign([], providers);

    return {
      imports: imports,
      global: options?.isGlobal || true,
      module: RepositoryModule,
      providers: providers,
      exports: exports,
    };
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/configs/configuration.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { DbContextModule } from 'src/typeorm/db-context.module';
import { RepositoryModule } from 'src/typeorm/repositories/repository.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SendmailModule } from './modules/sendmail/sendmail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
      load: [GLOBAL_CONFIG],
    }),
    SharedModule.forRoot({ isGlobal: true }),
    RepositoryModule.forRoot({ isGlobal: true }),
    DbContextModule,
    AuthModule,
    SendmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

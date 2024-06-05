import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/configs/config.interface';
import { UserAccount } from 'src/typeorm/entities/user-account.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'identity',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<DatabaseConfig>('database')[0].host,
        port: +configService.getOrThrow<DatabaseConfig>('database')[0].port,
        username:
          configService.getOrThrow<DatabaseConfig>('database')[0].username,
        password:
          configService.getOrThrow<DatabaseConfig>('database')[0].password,
        database:
          configService.getOrThrow<DatabaseConfig>('database')[0].tableName,
        entities: [UserAccount],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbContextModule {}

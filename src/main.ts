import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_PREFIX,
  ENVIRONMENT,
  SWAGGER_DES,
  SWAGGER_TITLE,
  API_PREFIX,
} from 'src/shared/constants/global.constants';
import { SwaggerConfig } from 'src/configs/config.interface';
import { ValidationPipeOptions } from 'src/base/pipes/validation.pipe';

async function bootstrap() {
  const projectRoot = process.cwd();
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.useStaticAssets(join(projectRoot, 'files'), {
    index: false,
    prefix: '/files',
  });
  const configService = app.get<ConfigService>(ConfigService);
  const environment = configService.getOrThrow<string>('environment');
  const swaggerConfig = configService.getOrThrow<SwaggerConfig>('swagger');
  if (environment === ENVIRONMENT.DEVELOP || true) {
    app.use(
      [swaggerConfig.path],
      basicAuth({
        challenge: true,
        users: swaggerConfig.basicAuth,
      }),
    );

    const configs = new DocumentBuilder()
      .setTitle(swaggerConfig.title || SWAGGER_TITLE)
      .setDescription(swaggerConfig.description || SWAGGER_DES)
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth(swaggerConfig.auth.authOptions, swaggerConfig.auth.name)
      .addSecurityRequirements('JWT-auth')
      .addBasicAuth()
      .build();
    const document = SwaggerModule.createDocument(
      app,
      configs,
      swaggerConfig.docOptions.options,
    );
    SwaggerModule.setup(
      swaggerConfig.path || SWAGGER_PREFIX,
      app,
      document,
      swaggerConfig.options,
    );
  }
  const config_service = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, './served'));
  app.useGlobalPipes(new ValidationPipeOptions());
  await app.listen(config_service.get('PORT'), () =>
    logger.log(`Application running on port ${config_service.get('PORT')}`),
  );
}
bootstrap();

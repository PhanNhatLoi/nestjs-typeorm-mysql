import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  SWAGGER_PREFIX,
  SWAGGER_DES,
  SWAGGER_TITLE,
} from 'src/shared/constants/global.constants';

export const GLOBAL_CONFIG = () => ({
  environment: process.env.ENVIRONMENT,
  database: [
    {
      host: process.env.DATABASE_HOST_1,
      port: process.env.DATABASE_PORT_1,
      username: process.env.DATABASE_USERNAME_1,
      password: process.env.DATABASE_PASSWORD_1,
      tableName: process.env.DATABASE_TABLE_NAME_1,
    },
    {
      host: process.env.DATABASE_HOST_2,
      port: process.env.DATABASE_PORT_2,
      username: process.env.DATABASE_USERNAME_2,
      password: process.env.DATABASE_PASSWORD_2,
      tableName: process.env.DATABASE_TABLE_NAME_2,
    },
    {
      host: process.env.DATABASE_HOST_3,
      port: process.env.DATABASE_PORT_3,
      username: process.env.DATABASE_USERNAME_3,
      password: process.env.DATABASE_PASSWORD_3,
      tableName: process.env.DATABASE_TABLE_NAME_3,
    },
  ],
  nest: {
    port: process.env.PORT,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    basicAuth: {
      ['admin']: 'admin@1230',
    },
    title: SWAGGER_TITLE,
    description: SWAGGER_DES,
    version: '1.5',
    path: SWAGGER_PREFIX,
    auth: {
      authOptions: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      name: 'JWT-auth',
    },
    options: {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        persistAuthorization: true,
        explorer: 'boolean',
        customCss: 'string',
        customCssUrl: 'string',
        customJs: 'string',
        customfavIcon: 'string',
        swaggerUrl: 'string',
        customSiteTitle: 'string',
        validatorUrl: 'string',
        url: 'string',
      },
    },
    docOptions: {
      options: {
        deepScanRoutes: true,
        operationIdFactory: (controllerKey: string, methodKey: string) =>
          methodKey,
      },
    },
  },
  jwtServiceConfig: {
    secretKey: process.env.JWT_SECRET_KEY,
    accessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },
  url: {
    go24BaseUrl: process.env.GO24_BASE_URL,
    go24Tracking: process.env.GO24_TRACKING_URL,
  },
});

export const multerConfig = {
  storage: diskStorage({
    destination: './files/images', // Directory where the files will be stored
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
};

export const multerPrivateConfig = {
  storage: diskStorage({
    destination: './files/images/private',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
};

export const multerOptions = {
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(new BadRequestException('Unsupported file type'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
};

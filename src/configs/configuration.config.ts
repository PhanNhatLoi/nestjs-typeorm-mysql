import {
  API_PREFIX,
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
    path: API_PREFIX,
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

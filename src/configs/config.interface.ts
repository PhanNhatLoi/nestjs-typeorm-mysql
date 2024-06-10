import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export interface Config {
  environment: string;
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  jwtServiceConfig: JwtServiceConfig;
  database: DatabaseConfig[];
  url: UrlConfig;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  tableName: string;
}
export interface NestConfig {
  port: number;
}
export interface CorsConfig {
  enabled: boolean;
}
export interface SwaggerConfig {
  enabled: boolean;
  basicAuth: {
    [username: string]: string;
  };
  title: string;
  description: string;
  version: string;
  path: string;
  auth: {
    authOptions: SecuritySchemeObject;
    name: string;
  };
  options: SwaggerOptions;
  docOptions: SwaggerDocOptions;
}

export interface SwaggerOptions {
  swaggerOptions: object;
}

export interface SwaggerDocOptions {
  options: object;
}

export interface JwtServiceConfig {
  secretKey: string;
  accessTokenExpirationTime: string;
  refreshTokenExpirationTime: string;
}

export interface UrlConfig {
  go24Base: string;
  go24Tracking: string;
}

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
      return cb(new Error('Unsupported file type'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
};

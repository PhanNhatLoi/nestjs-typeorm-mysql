import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

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

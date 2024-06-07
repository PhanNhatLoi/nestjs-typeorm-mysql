export const API_PREFIX = '/api/v1';
export const SWAGGER_PREFIX = '/swagger';
export const SWAGGER_TITLE = 'C-Connect-Vn api Project';
export const SWAGGER_DES = 'C-Connect-Vn Project API description';
export const DEFAULT_PAGE_LIMIT = 25;

export enum ENVIRONMENT {
  DEVELOP = 'develop',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum USER_ROLE {
  SUPPER_ADMIN = 'SUPPER_ADMIN',
  ENTERPRISE = 'ENTERPRISE',
  USER = 'USER',
}

export enum CATEGORY_TYPE {
  CATEGORY = 'CATEGORY',
  SUB_CATEGORY = 'SUB_CATEGORY',
}

export enum USER_ACTION_TYPE {
  VIEW = 'VIEW',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  VIEW_PAGE = 'VIEW_PAGE',
  RATE = 'RATE',
}

import { USER_ROLE } from 'src/shared/constants/global.constants';

export class CreateUserAccountDto {
  email: string;
  phone: string;
  password: string;
  socialLinks: {
    platform: string;
    accountName: string;
  }[];
  achievements: {
    title: string;
    value: number;
  }[];
  role: USER_ROLE;
}

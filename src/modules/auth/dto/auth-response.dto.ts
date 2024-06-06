import { UserAccount } from 'src/typeorm/entities/user-account.entity';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class AccountInfoResponseDto extends UserAccount {
  id: number;
  email: string;
  phoneNumber: string;
  createdDate: Date;
  address: string;
  job: string;
  imageUrl: string;
  referralID: number;
  emailVerified: boolean;
}

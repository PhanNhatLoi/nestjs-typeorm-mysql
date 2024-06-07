import { UserAccount } from 'src/typeorm/entities/user-account.entity';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class AccountInfoResponseDto extends UserAccount {}

import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MaxLength(6)
  otp: string;
}

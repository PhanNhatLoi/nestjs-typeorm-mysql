import {
  IsEmail,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';
export class ChangePasswordDto {
  @Column()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @IsNotEmpty()
  @Length(6)
  accessKey: string;
}

export class verifyChangePasswordDto {
  @Column()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @Length(6)
  otpCode: string;
}

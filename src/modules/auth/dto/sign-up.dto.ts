import { IsEmail, IsNotEmpty, IsPhoneNumber, MaxLength } from 'class-validator';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import { Column } from 'typeorm';
export class SignUpDto {
  @Column({
    unique: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: USER_ROLE;
}

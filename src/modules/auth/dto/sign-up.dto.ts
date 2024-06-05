import { IsEmail, IsNotEmpty, IsPhoneNumber, MaxLength } from 'class-validator';
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
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}

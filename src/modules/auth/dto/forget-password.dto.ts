import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Column } from 'typeorm';
export class ForgetPasswordDto {
  @Column()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;
}

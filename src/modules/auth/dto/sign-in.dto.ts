import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
export class SignInDto {
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  password: string;
}
